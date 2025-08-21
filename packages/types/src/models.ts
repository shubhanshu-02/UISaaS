import { Theme } from "./theme";

export interface User {
  id: string;
  email?: string;
  name?: string;
  tier: "DEMO" | "FREE" | "PRO" | "TEAM";
  isDemo: boolean;
  createdAt: string; // or Date
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  theme?: Theme;
}

export interface Component {
  id: string;
  name: string;
  code: string;
  meta?: any;
  projectId: string;
  isPublic: boolean;
  createdAt: string;
}
export { Theme };

