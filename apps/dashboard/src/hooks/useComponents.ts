import useSWR from 'swr';
import fetcher from '../utils/fetcher';
import type { Component, ApiResponse } from '@ui-saas/types';

export function useComponents(projectId: string) {
  const { data, error, mutate } = useSWR<ApiResponse<Component[]>>(
    projectId ? `/api/components?projectId=${projectId}` : null,
    fetcher
  );

  return {
    components: data?.data,
    isLoading: !error && !data,
    error: data?.error || error,
    mutate
  };
}
