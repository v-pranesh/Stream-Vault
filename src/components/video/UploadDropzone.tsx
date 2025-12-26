import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '@/hooks/useVideos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Film, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ACCEPTED_VIDEO_TYPES = {
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/ogg': ['.ogg'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
};

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export function UploadDropzone() {
  const navigate = useNavigate();
  const { uploadVideo } = useVideos();
  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const videoFile = acceptedFiles[0];
    
    if (videoFile) {
      if (videoFile.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds 500MB limit');
        return;
      }
      
      setFile(videoFile);
      // Auto-fill title from filename
      const fileName = videoFile.name.replace(/\.[^/.]+$/, '');
      setTitle(fileName);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_VIDEO_TYPES,
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error('Please provide a title for your video');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const video = await uploadVideo(file, title.trim(), description.trim(), (progress) => {
      setUploadProgress(progress);
    });

    if (video) {
      setUploadComplete(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setUploadProgress(0);
    setUploadComplete(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadComplete) {
    return (
      <Card className="glass-card border-success/50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6 animate-scale-in">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Upload Complete!</h3>
          <p className="text-muted-foreground mb-6">
            Your video is now processing. Redirecting to dashboard...
          </p>
          <Progress value={100} className="w-64" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      {!file ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
            transition-all duration-300
            ${isDragActive && !isDragReject
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : isDragReject
              ? 'border-destructive bg-destructive/5'
              : 'border-border hover:border-primary/50 hover:bg-secondary/30'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-4">
            <div className={`
              w-20 h-20 rounded-2xl flex items-center justify-center
              transition-all duration-300
              ${isDragActive ? 'bg-primary/20 scale-110' : 'bg-secondary'}
            `}>
              <Upload className={`w-10 h-10 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            
            <div>
              <p className="text-lg font-semibold text-foreground mb-1">
                {isDragActive
                  ? isDragReject
                    ? 'This file type is not supported'
                    : 'Drop your video here'
                  : 'Drag and drop your video'}
              </p>
              <p className="text-muted-foreground">
                or <span className="text-primary cursor-pointer hover:underline">browse files</span>
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Supported: MP4, WebM, MOV, AVI, OGG</span>
              <span>•</span>
              <span>Max size: 500MB</span>
            </div>
          </div>
        </div>
      ) : (
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Film className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading}
                className="bg-secondary/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your video (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
                rows={3}
                className="bg-secondary/50 resize-none"
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="text-primary font-medium">{uploadProgress}%</span>
                </div>
                <div className="relative">
                  <Progress value={uploadProgress} className="h-3" />
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="progress-shimmer w-full h-full" />
                  </div>
                </div>
              </div>
            )}
            
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleUpload}
              disabled={isUploading || !title.trim()}
            >
              {isUploading ? (
                <>
                  <Upload className="w-5 h-5 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
