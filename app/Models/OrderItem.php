<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'drink_id',
        'drink_name',
        'quantity',
        'price',
        'subtotal',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'quantity' => 'integer',
        'price' => 'integer',
        'subtotal' => 'integer',
    ];

    /**
     * @var array<int, string>
     */
    protected $appends = [
        'formatted_price',
        'formatted_subtotal',
    ];

    /**
     * @return BelongsTo<Order, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return BelongsTo<Drink, $this>
     */
    public function drink(): BelongsTo
    {
        return $this->belongsTo(Drink::class);
    }

    /**
     * @return Attribute<string, never>
     */
    protected function formattedPrice(): Attribute
    {
        return Attribute::make(
            get: fn (): string => 'Rp '.number_format($this->price, 0, ',', '.'),
        );
    }

    /**
     * @return Attribute<string, never>
     */
    protected function formattedSubtotal(): Attribute
    {
        return Attribute::make(
            get: fn (): string => 'Rp '.number_format($this->subtotal, 0, ',', '.'),
        );
    }
}
