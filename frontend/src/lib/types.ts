export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  protected: boolean;
  photoCount: number;
}

export interface Photo {
  id: string;
  title: string;
  description: string | null;
  url: string;
  createdAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}
