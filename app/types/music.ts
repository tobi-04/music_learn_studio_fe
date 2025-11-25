export interface MusicTrack {
  id: string;
  userId: string;
  username?: string; // From User entity
  userAvatar?: string; // From User entity
  title: string;
  description: string;
  fileUrl: string;
  coverImageUrl?: string;
  duration: number; // Duration in MINUTES
  fileSize: number;
  waveformData?: string;
  genre: string;
  tags: string[];
  playCount: number;
  likeCount: number;
  commentCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MusicComment {
  id: string;
  userId: string;
  trackId: string;
  content: string;
  timestamp?: number; // Optional time in track (seconds)
  createdAt: string;
  updatedAt: string;
}

export interface MusicLike {
  id: string;
  userId: string;
  trackId: string;
  createdAt: string;
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  trackIds: string[];
  isPublic: boolean;
  trackCount: number;
  totalDuration: number; // Total minutes
  createdAt: string;
  updatedAt: string;
}

export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface ArtistProfile {
  userId: string;
  username: string;
  name: string;
  avatar?: string;
  trackCount: number;
  followerCount: number;
  followingCount: number;
}
