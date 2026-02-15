'use client'
import React, { useEffect, useState } from 'react';

interface Categ {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface Props {
  params: { categoriesDetails: string };
}

export default function CategoriesDetails({ params }: Props) {
  const [category, setCategory] = useState<Categ | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${params.categoriesDetails}`);
        const data = await res.json();
        setCategory(data.data || null);
      } catch (err) {
        console.error(err);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [params.categoriesDetails]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!category) return <div className="p-10 text-center">Category not found</div>;

  return (
    <div className="p-10 flex justify-center">
      <div className="w-80 border rounded shadow overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-60 object-cover"
        />
        <h3 className="text-center font-semibold p-3">
          {category.name}
        </h3>
      </div>
    </div>
  );
}
