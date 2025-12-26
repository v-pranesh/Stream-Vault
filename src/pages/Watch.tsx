import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVideos } from '@/hooks/useVideos';
import { Navbar } from '@/components/layout/Navbar';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video } from '@/types';
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  Calendar,
  HardDrive,
  Film,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Watch() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const { videos, isLoading: videosLoading } = useVideos();
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!videosLoading && id) {
      const found = videos.find((v) => v.id === id);
      if (found) {
        setVideo(found);
      } else if (videos.length > 0) {
        navigate('/dashboard');
      }
    }
  }, [id, videos, videosLoading, navigate]);

  if (authLoading || videosLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !video) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const sensitivityConfig = {
    safe: {
      icon: Shield,
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: 'Safe Content',
    },
    flagged: {
      icon: ShieldAlert,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: 'Flagged for Review',
    },
    pending: {
      icon: Shield,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      label: 'Pending Analysis',
    },
  };

  const sensitivity = sensitivityConfig[video.sensitivity_result];
  const SensitivityIcon = sensitivity.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <Link to="/dashboard">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer video={video} />
            
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {video.title}
              </h1>
              {video.description && (
                <p className="text-muted-foreground">{video.description}</p>
              )}
            </div>
          </div>
          
          {/* Video Info Sidebar */}
          <div className="space-y-6">
            {/* Sensitivity Badge */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Content Analysis
              </h3>
              <div className={`flex items-center gap-3 p-4 rounded-lg ${sensitivity.bgColor}`}>
                <SensitivityIcon className={`w-6 h-6 ${sensitivity.color}`} />
                <div>
                  <p className={`font-semibold ${sensitivity.color}`}>
                    {sensitivity.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Automatic classification
                  </p>
                </div>
              </div>
            </div>
            
            {/* Video Details */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Video Details
              </h3>
              <div className="space-y-4">
                <DetailItem
                  icon={<Film className="w-4 h-4" />}
                  label="Format"
                  value={video.mime_type}
                />
                <DetailItem
                  icon={<HardDrive className="w-4 h-4" />}
                  label="File Size"
                  value={formatFileSize(video.file_size)}
                />
                <DetailItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="Uploaded"
                  value={formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                />
              </div>
            </div>
            
            {/* Status */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Status
              </h3>
              <Badge
                variant="secondary"
                className="bg-success/10 text-success border-0 px-4 py-2"
              >
                Ready to Stream
              </Badge>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
