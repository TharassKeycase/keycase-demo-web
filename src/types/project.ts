export interface ProjectSchema {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt: Date;
  updatedAt?: Date;
}