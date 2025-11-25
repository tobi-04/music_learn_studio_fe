import type { MusicTrack } from "~/types/music";

export const useMusicApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase || "http://localhost:6888";

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
    }
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "data",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );

    const response = await $fetch<{ data: MusicTrack }>(
      `${baseURL}/api/v1/music/tracks/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          "X-User-Id": "user1", // TODO: Get from auth
        },
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
        headers: {
          "X-User-Id": "user1", // TODO: Get from auth
        },
      }
    );
    return response.data;
  };

  const getRecentTracks = async () => {
    const response = await $fetch<{ data: MusicTrack[] }>(
      `${baseURL}/api/v1/music/tracks/recent`,
      {
        headers: {
          "X-User-Id": "user1", // TODO: Get from auth
        },
      }
    );
    return response.data;
  };

  const recordListening = async (trackId: string) => {
    await $fetch(`${baseURL}/api/v1/music/tracks/${trackId}/listen`, {
      method: "POST",
      headers: {
        "X-User-Id": "user1", // TODO: Get from auth
      },
    });
  };

  const deleteTrack = async (trackId: string) => {
    await $fetch(`${baseURL}/api/v1/music/tracks/${trackId}`, {
      method: "DELETE",
      headers: {
        "X-User-Id": "user1", // TODO: Get from auth
      },
    });
  };

  return {
    uploadTrack,
    getTrendingTracks,
    getMyTracks,
    getRecentTracks,
    recordListening,
    deleteTrack,
  };
};
