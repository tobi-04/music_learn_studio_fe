import type { Recording, CreateRecordingRequest } from "~/types/recording";

export const useRecordingApi = () => {
  const config = useRuntimeConfig();
  const { getAuthHeaders } = useAuthApi();

  const uploadRecording = async (
    file: File,
    data: CreateRecordingRequest
  ): Promise<Recording> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "data",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    const response = await $fetch<{ data: Recording }>(
      `${config.public.apiBase}/api/v1/studio/recordings/upload`,
      {
        method: "POST",
        body: formData,
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  };

  const getRecordingsByProject = async (
    projectId: string
  ): Promise<Recording[]> => {
    const response = await $fetch<{ data: Recording[] }>(
      `${config.public.apiBase}/api/v1/studio/recordings/project/${projectId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  };

  const getMyRecordings = async (): Promise<Recording[]> => {
    const response = await $fetch<{ data: Recording[] }>(
      `${config.public.apiBase}/api/v1/studio/recordings/my-recordings`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  };

  const deleteRecording = async (recordingId: string): Promise<void> => {
    await $fetch(
      `${config.public.apiBase}/api/v1/studio/recordings/${recordingId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
  };

  return {
    uploadRecording,
    getRecordingsByProject,
    getMyRecordings,
    deleteRecording,
  };
};
