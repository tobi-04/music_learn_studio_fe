import type { MusicTrack } from "~/types/music";

export const useMusicApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const baseURL = config.public.apiBase || "http://localhost:6888";

  /**
   * Get headers with user authentication
   */
  const getHeaders = () => {
    const headers: Record<string, string> = {};

    const user = authStore.user;
    const token = authStore.token;

    if (user?.id) {
      headers["X-User-Id"] = user.id;
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  };

  const uploadTrack = async (
    file: File,
    metadata: {
      title: string;
      description: string;
      genre: string;
      tags: string[];
      isPublic: boolean;
      duration: number;
      fileSize: number;
    },
    imageFile?: File
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append(
      "data",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );

    const response = await $fetch<{ data: MusicTrack }>(
      `${baseURL}/api/v1/music/tracks/upload`,
      {
        method: "POST",
        body: formData,
        headers: getHeaders(),
      }
    );

    return response.data;
  };

  const getTrendingTracks = async (genre?: string) => {
    const params = genre ? `?genre=${encodeURIComponent(genre)}` : "";
    const response = await $fetch<{ data: MusicTrack[] }>(
      `${baseURL}/api/v1/music/tracks/trending${params}`
    );
    return response.data;
  };

  const getMyTracks = async () => {
    const response = await $fetch<{ data: MusicTrack[] }>(
      `${baseURL}/api/v1/music/tracks/my-tracks`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  };

  const getRecentTracks = async () => {
    const response = await $fetch<{ data: MusicTrack[] }>(
      `${baseURL}/api/v1/music/tracks/recent`,
      {
        headers: getHeaders(),
      }
    );
    return response.data;
  };

  const recordListening = async (trackId: string) => {
    await $fetch(`${baseURL}/api/v1/music/tracks/${trackId}/listen`, {
      method: "POST",
      headers: getHeaders(),
    });
  };

  const deleteTrack = async (trackId: string) => {
    await $fetch(`${baseURL}/api/v1/music/tracks/${trackId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  };

  const updateTrack = async (
    trackId: string,
    metadata: {
      title: string;
      description: string;
      genre: string;
      tags: string[];
      isPublic: boolean;
    },
    imageFile?: File
  ) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append(
      "data",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );

    const response = await $fetch<{ data: MusicTrack }>(
      `${baseURL}/api/v1/music/tracks/${trackId}`,
      {
        method: "PUT",
        body: formData,
        headers: getHeaders(),
      }
    );

    return response.data;
  };

  const toggleLike = async (trackId: string) => {
    const response = await $fetch<{
      data: { liked: boolean; likeCount: number };
    }>(`${baseURL}/api/v1/music/tracks/${trackId}/like`, {
      method: "POST",
      headers: getHeaders(),
    });

    return response.data;
  };

  const getLikeStatus = async (trackId: string) => {
    const response = await $fetch<{
      data: { liked: boolean; likeCount: number };
    }>(`${baseURL}/api/v1/music/tracks/${trackId}/like-status`, {
      method: "GET",
      headers: getHeaders(),
    });

    return response.data;
  };

  return {
    uploadTrack,
    updateTrack,
    getTrendingTracks,
    getMyTracks,
    getRecentTracks,
    recordListening,
    toggleLike,
    getLikeStatus,
    deleteTrack,
  };
};
