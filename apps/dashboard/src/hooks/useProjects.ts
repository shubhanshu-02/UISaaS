import useSWR from 'swr';
import fetcher from '../utils/fetcher';

export function useProjects() {
  const { data, error, mutate } = useSWR('/api/projects', fetcher);
  return { projects: data, isLoading: !error && !data, error, mutate };
}
