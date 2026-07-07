import { useQuery } from "@tanstack/react-query";

type BookOffering = {
  id: number;
  name: string;
  description: string;
  priceEur: number;
  unit: string;
  tag: string | null;
  icon: string | null;
  imageUrl: string | null;
  linkType: string;
};

type BooksResponse = { books: BookOffering[] };

export function useListBooks() {
  return useQuery<BooksResponse>({
    queryKey: ["/api/books"],
    queryFn: async () => {
      const res = await fetch("/api/books");
      if (!res.ok) throw new Error("Failed to fetch books");
      return res.json();
    },
  });
}
