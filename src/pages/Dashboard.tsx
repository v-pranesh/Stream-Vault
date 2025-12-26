import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVideos } from '@/hooks/useVideos';
import { Navbar } from '@/components/layout/Navbar';
import { VideoCard } from '@/components/video/VideoCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Video, Play, Shield, Users } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, roles, isLoading: authLoading, canUpload } = useAuth();
  const { videos, isLoading: videosLoading } = useVideos();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const stats = {
    total: videos.length,
    processing: videos.filter((v) => v.status === 'processing').length,
    completed: videos.filter((v) => v.status === 'completed').length,
    safe: videos.filter((v) => v.sensitivity_result === 'safe').length,
    flagged: videos.filter((v) => v.sensitivity_result === 'flagged').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, <span className="text-gradient">{profile?.full_name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your videos and monitor processing status
            </p>
          </div>
          
          {canUpload() && (
            <Link to="/upload">
              <Button variant="hero" size="lg" className="gap-2">
                <Upload className="w-5 h-5" />
                Upload Video
              </Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Video className="w-5 h-5" />}
            label="Total Videos"
            value={stats.total}
            color="primary"
          />
          <StatCard
            icon={<Play className="w-5 h-5" />}
            label="Completed"
            value={stats.completed}
            color="success"
          />
          <StatCard
            icon={<Shield className="w-5 h-5" />}
            label="Safe"
            value={stats.safe}
            color="success"
          />
          <StatCard
            icon={<Shield className="w-5 h-5" />}
            label="Flagged"
            value={stats.flagged}
            color="warning"
          />
        </div>

        {/* Videos Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Your Videos</h2>
          
          {videosLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <EmptyState canUpload={canUpload()} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'primary' | 'success' | 'warning';
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function VideoCardSkeleton() {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Skeleton className="aspect-video" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

function EmptyState({ canUpload }: { canUpload: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 glass-card rounded-xl">
      <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6">
        <Video className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No videos yet</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        {canUpload
          ? 'Upload your first video to get started with processing and streaming.'
          : 'Videos shared with you will appear here.'}
      </p>
      {canUpload && (
        <Link to="/upload">
          <Button variant="hero" className="gap-2">
            <Upload className="w-5 h-5" />
            Upload Your First Video
          </Button>
        </Link>
      )}
    </div>
  );
}
