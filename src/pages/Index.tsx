import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import {
  Play,
  Upload,
  Shield,
  Zap,
  Users,
  Lock,
  ArrowRight,
  Video,
  CheckCircle,
} from 'lucide-react';

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        
        <div className="container relative pt-24 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Enterprise-grade video platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in-up leading-tight">
              Upload, Process &
              <br />
              <span className="text-gradient">Stream Videos</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              A complete video management solution with real-time processing,
              AI-powered sensitivity classification, and secure multi-tenant streaming.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {user ? (
                <Link to="/dashboard">
                  <Button variant="hero" size="xl" className="gap-2 group">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="hero" size="xl" className="gap-2 group">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button variant="glass" size="xl" className="gap-2">
                    <Play className="w-5 h-5" />
                    Watch Demo
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need for
              <br />
              <span className="text-gradient">video management</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From upload to streaming, we handle the entire video lifecycle
              with enterprise-grade security and performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Upload className="w-6 h-6" />}
              title="Drag & Drop Upload"
              description="Simple drag and drop interface with real-time progress tracking and multi-format support."
              delay={0}
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Real-time Processing"
              description="Watch your videos process in real-time with live progress updates via WebSocket."
              delay={100}
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="AI Content Analysis"
              description="Automatic sensitivity classification to keep your content library safe and organized."
              delay={200}
            />
            <FeatureCard
              icon={<Video className="w-6 h-6" />}
              title="HTTP Range Streaming"
              description="Efficient video streaming with HTTP Range requests for smooth playback."
              delay={300}
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Multi-tenant Isolation"
              description="Complete data isolation between organizations with secure tenant boundaries."
              delay={400}
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Role-based Access"
              description="Granular permissions with Viewer, Editor, and Admin roles for secure collaboration."
              delay={500}
            />
          </div>
        </div>
      </section>
      
      {/* Roles Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        
        <div className="container relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Role-based Access Control
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three distinct roles to manage your team's video workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <RoleCard
              role="Viewer"
              description="View and stream videos within your organization"
              permissions={['View videos', 'Stream content', 'Access dashboard']}
              color="secondary"
            />
            <RoleCard
              role="Editor"
              description="Upload and manage your own video content"
              permissions={['All Viewer permissions', 'Upload videos', 'Edit metadata', 'Delete own videos']}
              color="primary"
              featured
            />
            <RoleCard
              role="Admin"
              description="Full access to all organization resources"
              permissions={['All Editor permissions', 'Manage all videos', 'User management', 'Organization settings']}
              color="accent"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of creators and teams using StreamVault
                for their video management needs.
              </p>
              
              <Link to="/auth">
                <Button variant="hero" size="xl" className="gap-2 group">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Play className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-gradient">StreamVault</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 StreamVault. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div
      className="glass-card rounded-xl p-6 group hover:border-primary/30 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function RoleCard({
  role,
  description,
  permissions,
  color,
  featured,
}: {
  role: string;
  description: string;
  permissions: string[];
  color: 'primary' | 'secondary' | 'accent';
  featured?: boolean;
}) {
  const colorClasses = {
    primary: 'border-primary/50 bg-primary/5',
    secondary: 'border-border',
    accent: 'border-accent/50 bg-accent/5',
  };

  return (
    <div
      className={`glass-card rounded-xl p-6 ${colorClasses[color]} ${
        featured ? 'ring-2 ring-primary/20 scale-105' : ''
      } transition-all duration-300 hover:scale-105`}
    >
      <h3 className="text-xl font-bold text-foreground mb-2">{role}</h3>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-2">
        {permissions.map((permission) => (
          <li key={permission} className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-success shrink-0" />
            <span className="text-foreground">{permission}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
