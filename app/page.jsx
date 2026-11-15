import { getDrinks } from '@/lib/data';
import CatalogClient from '@/components/Catalog/CatalogClient';

export const revalidate = 0; // Always fresh drinks data

export default async function Page() {
  const drinks = await getDrinks();
  const categories = Array.from(new Set(drinks.map((d) => d.category).filter(Boolean)));

  return <CatalogClient initialDrinks={drinks} categories={categories} />;
}
