export interface Story {
    id: number;
    title: string;
    content: {
      german: string;
      english: string;
    }[];
  }