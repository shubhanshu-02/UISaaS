
export interface CreateProjectPayload {
  name: string;
  slug: string;
}

export interface CreateComponentPayload {
  name: string;
  code: string;
  projectId: string;
  meta?: any;
}

export interface UpdateComponentPayload {
  code?: string;
  isPublic?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
