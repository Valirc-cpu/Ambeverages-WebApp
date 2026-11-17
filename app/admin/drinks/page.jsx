import { getAdminDrinks, getStoreSettings } from '@/lib/data';
import DrinksClient from '@/components/Admin/DrinksClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDrinksPage() {
  const [{ drinks, categories, stats }, storeSettings] = await Promise.all([
    getAdminDrinks(),
    getStoreSettings(),
  ]);

  return (
    <DrinksClient
      initialDrinks={drinks}
      initialCategories={categories}
      initialStats={stats}
      initialIsCatalogOpen={storeSettings.is_catalog_open}
    />
  );
}
