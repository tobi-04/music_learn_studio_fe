export interface LikeStatus {
  liked: boolean;
  likeCount: number;
}

export interface Comment {
  id: string;
  trackId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
}
