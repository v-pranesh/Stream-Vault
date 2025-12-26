import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { UploadDropzone } from '@/components/video/UploadDropzone';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Upload() {
  const navigate = useNavigate();
  const { user, isLoading, canUpload } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    } else if (!isLoading && user && !canUpload()) {
      navigate('/dashboard');
    }
  }, [user, isLoading, canUpload, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !canUpload()) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 max-w-3xl">
        <Link to="/dashboard">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Upload Video
          </h1>
          <p className="text-muted-foreground">
            Upload a video file to start processing. Supported formats: MP4, WebM, MOV, AVI, OGG
          </p>
        </div>
        
        <UploadDropzone />
      </main>
    </div>
  );
}
