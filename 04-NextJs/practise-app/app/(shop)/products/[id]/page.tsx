import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct } from "@/lib/db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    
    const { id } = await params;
    const product = await getProduct(id);

    if(!product){
        notFound();
    }

    return {
        title: product.name,
        description: product.description,
    };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product){
    notFound();
  }
  return <h1>You are looking at product {product.name}</h1>;
}
