export interface Fish {
  id: number;
  name: string;
  japaneseName: string;
  classification: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}
