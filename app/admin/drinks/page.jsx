import { getAdminDrinks } from '@/lib/data';
import DrinksClient from '@/components/Admin/DrinksClient';

export const revalidate = 0;

export default async function AdminDrinksPage() {
  const { drinks, categories, stats } = await getAdminDrinks();

  return (
    <DrinksClient
      initialDrinks={drinks}
      initialCategories={categories}
      initialStats={stats}
    />
  );
}
