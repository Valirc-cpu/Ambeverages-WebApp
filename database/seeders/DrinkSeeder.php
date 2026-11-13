<?php

namespace Database\Seeders;

use App\Models\Drink;
use Illuminate\Database\Seeder;

class DrinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $drinks = [
            [
                'name' => 'MetaMask Fox Mocha',
                'category' => 'Signature',
                'price' => 28000,
                'stock' => 25,
                'image' => 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&auto=format&fit=crop&q=80',
                'description' => 'Espresso kaya rasa berpadu dark cocoa Belgia dengan hint orange zest khas MetaMask.',
                'is_active' => true,
            ],
            [
                'name' => 'Ethereum Nitro Cold Brew',
                'category' => 'Kopi',
                'price' => 25000,
                'stock' => 30,
                'image' => 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
                'description' => 'Cold brew diekstrak selama 24 jam, menghasilkan kopi lembut berbusa mikro tanpa gula tambahan.',
                'is_active' => true,
            ],
            [
                'name' => 'Web3 Caramel Macchiato',
                'category' => 'Kopi',
                'price' => 26000,
                'stock' => 20,
                'image' => 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&auto=format&fit=crop&q=80',
                'description' => 'Susu segar vanila, espresso roast ganda, dan lelehan saus karamel artisanal.',
                'is_active' => true,
            ],
            [
                'name' => 'ConsenSys Matcha Cream Latte',
                'category' => 'Non-Kopi',
                'price' => 27000,
                'stock' => 15,
                'image' => 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
                'description' => 'Bubuk matcha murni asal Uji, Kyoto berpadu susu creamy dan sentuhan manis alami.',
                'is_active' => true,
            ],
            [
                'name' => 'Decentralized Taro Velvet',
                'category' => 'Non-Kopi',
                'price' => 24000,
                'stock' => 18,
                'image' => 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
                'description' => 'Taro ungu bertekstur beludru yang wangi, gurih, dan menyegarkan saat disajikan dingin.',
                'is_active' => true,
            ],
            [
                'name' => 'Solidity Sparkling Berry',
                'category' => 'Mocktail',
                'price' => 23000,
                'stock' => 22,
                'image' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
                'description' => 'Soda dingin berkarbonasi tinggi dengan sari buah beri segar dan perasan daun mint.',
                'is_active' => true,
            ],
            [
                'name' => 'Polygon Citrus Mint Tea',
                'category' => 'Tea',
                'price' => 20000,
                'stock' => 35,
                'image' => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
                'description' => 'Seduhan teh melati wangi dengan irisan jeruk lemon segar dan daun mint aromatik.',
                'is_active' => true,
            ],
            [
                'name' => 'Crypto Hazelnut Frappe',
                'category' => 'Signature',
                'price' => 29000,
                'stock' => 12,
                'image' => 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop&q=80',
                'description' => 'Frappe espresso hazelnut dengan es serut lembut dan topping taburan kacang panggang.',
                'is_active' => true,
            ],
        ];

        foreach ($drinks as $drink) {
            Drink::create($drink);
        }
    }
}
