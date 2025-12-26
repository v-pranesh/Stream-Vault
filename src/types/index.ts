export type AppRole = 'admin' | 'editor' | 'viewer';

export type VideoStatus = 'uploading' | 'processing' | 'completed' | 'failed';

export type SensitivityResult = 'safe' | 'flagged' | 'pending';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  tenant_id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_size: number;
  mime_type: string;
  duration: number | null;
  thumbnail_path: string | null;
  status: VideoStatus;
  processing_progress: number;
  sensitivity_result: SensitivityResult;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: {
    id: string;
    email: string;
  } | null;
  profile: Profile | null;
  roles: AppRole[];
  isLoading: boolean;
}
