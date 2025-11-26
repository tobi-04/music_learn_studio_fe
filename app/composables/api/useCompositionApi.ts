import type {
  MusicComposition,
  CreateCompositionRequest,
  UpdateCompositionRequest,
  BaseResponse,
} from "~/types";

export const useCompositionApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const baseUrl = config.public.apiBase || "http://localhost:6888";

  /**
   * Get headers with user authentication
   */
  const getHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

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

  /**
   * Create a new composition
   */
  const createComposition = async (data: CreateCompositionRequest) => {
    return await $fetch<BaseResponse<MusicComposition>>(
      `${baseUrl}/api/v1/music/compositions`,
      {
        method: "POST",
        body: data,
        headers: getHeaders(),
      }
    );
  };

  /**
   * Get or create a draft composition
   */
  const getOrCreateDraft = async () => {
    return await $fetch<BaseResponse<MusicComposition>>(
      `${baseUrl}/api/v1/music/compositions/draft`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );
  };

  /**
   * Update a composition
   */
  const updateComposition = async (
    compositionId: string,
    data: UpdateCompositionRequest
  ) => {
    return await $fetch<BaseResponse<MusicComposition>>(
      `${baseUrl}/api/v1/music/compositions/${compositionId}`,
      {
        method: "PUT",
        body: data,
        headers: getHeaders(),
      }
    );
  };

  /**
   * Get composition by ID
   */
  const getCompositionById = async (compositionId: string) => {
    return await $fetch<BaseResponse<MusicComposition>>(
      `${baseUrl}/api/v1/music/compositions/${compositionId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );
  };

  /**
   * Get all user compositions
   */
  const getMyCompositions = async () => {
    const response = await $fetch<BaseResponse<MusicComposition[]>>(
      `${baseUrl}/api/v1/music/compositions/my-compositions`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );
    return response.data;
  };

  /**
   * Get user drafts
   */
  const getMyDrafts = async () => {
    const response = await $fetch<BaseResponse<MusicComposition[]>>(
      `${baseUrl}/api/v1/music/compositions/my-drafts`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );
    return response.data;
  };

  /**
   * Get user published compositions
   */
  const getMyPublished = async () => {
    const response = await $fetch<BaseResponse<MusicComposition[]>>(
      `${baseUrl}/api/v1/music/compositions/my-published`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );
    return response.data;
  };

  /**
   * Get public compositions
   */
  const getPublicCompositions = async () => {
    const response = await $fetch<BaseResponse<MusicComposition[]>>(
      `${baseUrl}/api/v1/music/compositions/public`,
      {
        method: "GET",
      }
    );
    return response.data;
  };

  /**
   * Publish a composition
   */
  const publishComposition = async (compositionId: string, audioFile: File) => {
    const formData = new FormData();
    formData.append("audioFile", audioFile);

    const headers = getHeaders();
    // Remove Content-Type for multipart/form-data
    delete headers["Content-Type"];

    return await $fetch<BaseResponse<MusicComposition>>(
      `${baseUrl}/api/v1/music/compositions/${compositionId}/publish`,
      {
        method: "POST",
        body: formData,
        headers,
      }
    );
  };

  /**
   * Delete a composition
   */
  const deleteComposition = async (compositionId: string) => {
    return await $fetch<BaseResponse<void>>(
      `${baseUrl}/api/v1/music/compositions/${compositionId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );
  };

  /**
   * Duplicate a composition
   */
  const duplicateComposition = async (compositionId: string) => {
    return await $fetch<BaseResponse<MusicComposition>>(
      `${baseUrl}/api/v1/music/compositions/${compositionId}/duplicate`,
      {
        method: "POST",
        headers: getHeaders(),
      }
    );
  };

  return {
    createComposition,
    getOrCreateDraft,
    updateComposition,
    getCompositionById,
    getMyCompositions,
    getMyDrafts,
    getMyPublished,
    getPublicCompositions,
    publishComposition,
    deleteComposition,
    duplicateComposition,
  };
};
