import type { LikeStatus, Comment, CreateCommentRequest } from "~/types/social";

export const useSocialApi = () => {
  const config = useRuntimeConfig();
  const { getAuthHeaders } = useAuthApi();

  const toggleLike = async (trackId: string): Promise<LikeStatus> => {
    const response = await $fetch<{ data: LikeStatus }>(
      `${config.public.apiBase}/api/v1/music/tracks/${trackId}/like`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  };

  const getLikeStatus = async (trackId: string): Promise<LikeStatus> => {
    const response = await $fetch<{ data: LikeStatus }>(
      `${config.public.apiBase}/api/v1/music/tracks/${trackId}/like-status`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  };

  const getLikedTracks = async (): Promise<string[]> => {
    const response = await $fetch<{ data: string[] }>(
      `${config.public.apiBase}/api/v1/music/tracks/liked`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  };

  const addComment = async (
    trackId: string,
    request: CreateCommentRequest
  ): Promise<Comment> => {
    const response = await $fetch<{ data: Comment }>(
      `${config.public.apiBase}/api/v1/music/tracks/${trackId}/comments`,
      {
        method: "POST",
        body: request,
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  };

  const getComments = async (trackId: string): Promise<Comment[]> => {
    const response = await $fetch<{ data: Comment[] }>(
      `${config.public.apiBase}/api/v1/music/tracks/${trackId}/comments`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  };

  const deleteComment = async (commentId: string): Promise<void> => {
    await $fetch(
      `${config.public.apiBase}/api/v1/music/tracks/comments/${commentId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
  };

  return {
    toggleLike,
    getLikeStatus,
    getLikedTracks,
    addComment,
    getComments,
    deleteComment,
  };
};
