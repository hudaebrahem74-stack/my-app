'use client'
import React, { useEffect, useState } from 'react';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Props {
  params: { brandDetails: string };
}


export default function BrandDetails({ params }: Props) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrand() {
      try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${params.brandDetails}`);
        const data = await res.json();
        setBrand(data.data || null);
      } catch (err) {
        console.error(err);
        setBrand(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBrand();
  }, [params.brandDetails]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!brand) return <div className="p-10 text-center">Brand not found</div>;

  return (
    <div className="p-10 flex justify-center">
      <div className="w-80 border rounded shadow overflow-hidden">
        <img src={brand.image} alt={brand.name} className="w-full h-60 object-cover" />
        <h3 className="text-center font-semibold p-3">{brand.name}</h3>
      </div>
    </div>
  );
}
