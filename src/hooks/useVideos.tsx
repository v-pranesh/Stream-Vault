import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/types';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useVideos() {
  const { user, profile } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    if (!user) {
      setVideos([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos((data as Video[]) || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('videos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'videos',
        },
        (payload) => {
          console.log('Video change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            setVideos((prev) => [payload.new as Video, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setVideos((prev) =>
              prev.map((v) => (v.id === payload.new.id ? (payload.new as Video) : v))
            );
          } else if (payload.eventType === 'DELETE') {
            setVideos((prev) => prev.filter((v) => v.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const uploadVideo = async (
    file: File,
    title: string,
    description: string,
    onProgress?: (progress: number) => void
  ): Promise<Video | null> => {
    if (!user || !profile) {
      toast.error('You must be logged in to upload videos');
      return null;
    }

    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      onProgress?.(10);

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;
      
      onProgress?.(50);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Create video record
      const { data: video, error: insertError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          tenant_id: profile.tenant_id,
          title,
          description,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type,
          status: 'processing',
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      onProgress?.(70);

      // Start processing simulation
      simulateProcessing(video.id);
      
      onProgress?.(100);
      
      toast.success('Video uploaded successfully');
      return video as Video;
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
      return null;
    }
  };

  const simulateProcessing = async (videoId: string) => {
    // Simulate processing progress
    const progressSteps = [10, 25, 40, 55, 70, 85, 100];
    
    for (const progress of progressSteps) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const isComplete = progress === 100;
      const sensitivityResult = Math.random() > 0.2 ? 'safe' : 'flagged';
      
      await supabase
        .from('videos')
        .update({
          processing_progress: progress,
          status: isComplete ? 'completed' : 'processing',
          sensitivity_result: isComplete ? sensitivityResult : 'pending',
        })
        .eq('id', videoId);
    }
  };

  const deleteVideo = async (videoId: string, filePath: string) => {
    try {
      // Delete from storage
      await supabase.storage.from('videos').remove([filePath]);
      
      // Delete from database
      const { error } = await supabase.from('videos').delete().eq('id', videoId);
      
      if (error) throw error;
      
      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  const getVideoUrl = (filePath: string) => {
    const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
    return data.publicUrl;
  };

  return {
    videos,
    isLoading,
    uploadVideo,
    deleteVideo,
    getVideoUrl,
    refetch: fetchVideos,
  };
}
