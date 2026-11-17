import { getDrinks, getStoreSettings } from '@/lib/data';
import CatalogClient from '@/components/Catalog/CatalogClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const [drinks, storeSettings] = await Promise.all([
    getDrinks(),
    getStoreSettings(),
  ]);

  return (
    <CatalogClient
      initialDrinks={drinks}
      initialIsOpen={storeSettings.is_catalog_open}
    />
  );
}
