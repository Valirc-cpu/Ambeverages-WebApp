<?php

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_CONFIRMED = 'confirmed';

    public const STATUS_CANCELLED = 'cancelled';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'order_code',
        'customer_name',
        'customer_phone',
        'notes',
        'total_price',
        'status',
        'confirmed_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'total_price' => 'integer',
        'confirmed_at' => 'datetime',
    ];

    /**
     * @var array<int, string>
     */
    protected $appends = [
        'formatted_total_price',
    ];

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * @return Attribute<string, never>
     */
    protected function formattedTotalPrice(): Attribute
    {
        return Attribute::make(
            get: fn (): string => 'Rp '.number_format($this->total_price, 0, ',', '.'),
        );
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isConfirmed(): bool
    {
        return $this->status === self::STATUS_CONFIRMED;
    }

    public function isCancelled(): bool
    {
        return $this->status === self::STATUS_CANCELLED;
    }
}
