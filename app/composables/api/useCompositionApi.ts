import type {
  MusicComposition,
  CreateCompositionRequest,
  UpdateCompositionRequest,
  BaseResponse,
} from "~/types";

export const useCompositionApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || "http://localhost:6888";

  /**
   * Create a new composition
   */
  const createComposition = async (data: CreateCompositionRequest) => {
    return await $fetch<BaseResponse<MusicComposition>>(
      `${baseUrl}/api/v1/music/compositions`,
      {
        method: "POST",
        body: data,
        headers: {
          "X-User-Id": "user1", // TODO: Get from auth store
        },
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
        headers: {
          "X-User-Id": "user1", // TODO: Get from auth store
        },
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
        headers: {
          "X-User-Id": "user1", // TODO: Get from auth store
        },
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
        headers: {
          "X-User-Id": "user1", // TODO: Get from auth store
        },
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
        headers: {
          "X-User-Id": "user1", // TODO: Get from auth store
        },
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
        headers: {
          "X-User-Id": "user1", // TODO: Get from auth store
        },
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

    return await $fetch<BaseResponse<MusicComposition>>(
      `${baseUrl}/api/v1/music/compositions/${compositionId}/publish`,
      {
        method: "POST",
        body: formData,
        headers: {
          "X-User-Id": "user1", // TODO: Get from auth store
        },
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
        headers: {
          "X-User-Id": "user1", // TODO: Get from auth store
        },
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
        headers: {
          "X-User-Id": "user1", // TODO: Get from auth store
        },
      }
    );
  };

  return {
    createComposition,
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
