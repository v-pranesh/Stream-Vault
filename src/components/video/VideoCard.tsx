import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Video } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useVideos } from '@/hooks/useVideos';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Play,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Shield,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const { canDelete } = useAuth();
  const { deleteVideo, getVideoUrl } = useVideos();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteVideo(video.id, video.file_path);
    setIsDeleting(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const statusConfig = {
    uploading: {
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: 'Uploading',
    },
    processing: {
      icon: Loader2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      label: 'Processing',
    },
    completed: {
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: 'Completed',
    },
    failed: {
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      label: 'Failed',
    },
  };

  const sensitivityConfig = {
    safe: {
      icon: Shield,
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: 'Safe',
    },
    flagged: {
      icon: ShieldAlert,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      label: 'Flagged',
    },
    pending: {
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      label: 'Pending',
    },
  };

  const status = statusConfig[video.status];
  const sensitivity = sensitivityConfig[video.sensitivity_result];
  const StatusIcon = status.icon;
  const SensitivityIcon = sensitivity.icon;

  const isPlayable = video.status === 'completed';

  return (
    <Card className="group glass-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      {/* Thumbnail / Preview */}
      <CardHeader className="p-0 relative aspect-video bg-muted overflow-hidden">
        {video.thumbnail_path ? (
          <img
            src={getVideoUrl(video.thumbnail_path)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <Play className="w-12 h-12 text-muted-foreground/50" />
          </div>
        )}

        {/* Status overlay */}
        {video.status === 'processing' && (
          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <div className="w-3/4 max-w-[200px]">
              <Progress value={video.processing_progress} className="h-2" />
              <p className="text-center text-sm text-muted-foreground mt-2">
                Processing... {video.processing_progress}%
              </p>
            </div>
          </div>
        )}

        {/* Play button overlay */}
        {isPlayable && (
          <Link
            to={`/watch/${video.id}`}
            className="absolute inset-0 flex items-center justify-center bg-background/0 group-hover:bg-background/40 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 glow-effect">
              <Play className="w-8 h-8 text-primary ml-1" />
            </div>
          </Link>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            variant="secondary"
            className={`${status.bgColor} ${status.color} border-0`}
          >
            <StatusIcon className={`w-3 h-3 mr-1 ${video.status === 'processing' ? 'animate-spin' : ''}`} />
            {status.label}
          </Badge>
        </div>

        {video.status === 'completed' && (
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className={`${sensitivity.bgColor} ${sensitivity.color} border-0`}
            >
              <SensitivityIcon className="w-3 h-3 mr-1" />
              {sensitivity.label}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {video.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{formatFileSize(video.file_size)}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {isPlayable && (
          <Link to={`/watch/${video.id}`} className="flex-1">
            <Button variant="hero" className="w-full gap-2">
              <Play className="w-4 h-4" />
              Watch
            </Button>
          </Link>
        )}

        {canDelete() && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Video</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{video.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}
