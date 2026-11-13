<?php

namespace Database\Factories;

use App\Models\Drink;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Drink>
 */
class DrinkFactory extends Factory
{
    protected $model = Drink::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Meta Espresso Double',
                'Web3 Caramel Macchiato',
                'ConsenSys Matcha Latte',
                'Ethereum Cold Brew',
                'Decentralized Peach Tea',
                'Polygon Sparkling Lemonade',
                'Solidity Chocolate Frappe',
                'Smart Contract Taro Milk',
            ]),
            'price' => fake()->randomElement([18000, 22000, 25000, 28000, 32000]),
            'stock' => fake()->numberBetween(10, 50),
            'image' => null,
            'description' => fake()->sentence(8),
            'category' => fake()->randomElement(['Ambmanggo', 'Amberry', 'Ambpinaple']),
            'is_active' => true,
        ];
    }
}
