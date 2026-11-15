import { getDrinks } from '@/lib/data';
import CatalogClient from '@/components/Catalog/CatalogClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const drinks = await getDrinks();

  return <CatalogClient initialDrinks={drinks} />;
}
