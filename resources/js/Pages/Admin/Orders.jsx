import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Card from '../../Components/Card';
import Badge from '../../Components/Badge';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import {
    ShoppingCart,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Search,
    MessageSquare,
    ExternalLink,
    Coffee,
    AlertTriangle,
    Eye,
    Check,
    X
} from 'lucide-react';

export default function Orders({ orders = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [currentStatus, setCurrentStatus] = useState(filters.status || 'all');
    const [confirmModalOrder, setConfirmModalOrder] = useState(null);
    const [cancelModalOrder, setCancelModalOrder] = useState(null);
    const [detailModalOrder, setDetailModalOrder] = useState(null);
    const [processingAction, setProcessingAction] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/orders',
            { search, status: currentStatus },
            { preserveState: true, replace: true }
        );
    };

    const handleStatusTab = (status) => {
        setCurrentStatus(status);
        router.get(
            '/admin/orders',
            { search, status },
            { preserveState: true, replace: true }
        );
    };

    const executeConfirmOrder = () => {
        if (!confirmModalOrder) return;
        setProcessingAction(true);
        router.post(
            `/admin/orders/${confirmModalOrder.id}/confirm`,
            {},
            {
                onFinish: () => {
                    setProcessingAction(false);
                    setConfirmModalOrder(null);
                },
            }
        );
    };

    const executeCancelOrder = () => {
        if (!cancelModalOrder) return;
        setProcessingAction(true);
        router.post(
            `/admin/orders/${cancelModalOrder.id}/cancel`,
            {},
            {
                onFinish: () => {
                    setProcessingAction(false);
                    setCancelModalOrder(null);
                },
            }
        );
    };

    return (
        <AdminLayout title="Kelola Pesanan Masuk">
            <Head title="Kelola Pesanan Masuk - Admin" />

            <div className="space-y-6 pt-6">
                {/* Header title */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                            <ShoppingCart className="w-6 h-6 text-[#F6851B]" />
                            <span>Pesanan Masuk</span>
                        </h1>
                        <p className="text-xs text-[#8F96A0] mt-1">
                            Kelola pesanan pembeli dan lakukan konfirmasi untuk otomatis memotong stok minuman.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="flex items-center gap-4 bg-[#181A1D] border-[#2A2E35]">
                        <div className="p-3 rounded-xl bg-[#F6851B]/15 text-[#F6851B]">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-semibold text-[#8F96A0] block">
                                Menunggu Konfirmasi
                            </span>
                            <span className="text-2xl font-bold text-[#F6851B]">
                                {stats.pending_orders || 0}
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-[#181A1D] border-[#2A2E35]">
                        <div className="p-3 rounded-xl bg-[#28A745]/15 text-[#48D168]">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-semibold text-[#8F96A0] block">
                                Pesanan Dikonfirmasi
                            </span>
                            <span className="text-2xl font-bold text-white">
                                {stats.confirmed_orders || 0}
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-[#181A1D] border-[#2A2E35]">
                        <div className="p-3 rounded-xl bg-[#037DD6]/15 text-[#42A5F5]">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-semibold text-[#8F96A0] block">
                                Total Pesanan
                            </span>
                            <span className="text-2xl font-bold text-white">
                                {stats.total_orders || 0}
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-[#181A1D] border-[#2A2E35]">
                        <div className="p-3 rounded-xl bg-purple-500/15 text-purple-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-semibold text-[#8F96A0] block">
                                Total Pendapatan
                            </span>
                            <span className="text-2xl font-bold text-white">
                                {stats.formatted_total_revenue || 'Rp 0'}
                            </span>
                        </div>
                    </Card>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {[
                            { id: 'all', label: 'Semua Pesanan' },
                            { id: 'pending', label: 'Menunggu' },
                            { id: 'confirmed', label: 'Dikonfirmasi' },
                            { id: 'cancelled', label: 'Dibatalkan' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => handleStatusTab(tab.id)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                    currentStatus === tab.id
                                        ? 'bg-[#F6851B] text-white shadow-[0_4px_12px_rgba(246,133,27,0.3)]'
                                        : 'bg-[#181A1D] text-[#8F96A0] hover:text-white border border-[#2B2F36]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="relative min-w-[260px]">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F96A0]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kode order, nama pemesan..."
                            className="w-full pl-9 pr-4 py-2 bg-[#181A1D] border border-[#2B2F36] focus:border-[#F6851B] rounded-xl text-white placeholder-[#5A606A] text-xs outline-none"
                        />
                    </form>
                </div>

                {/* Orders List / Table */}
                {orders.data.length === 0 ? (
                    <Card className="text-center py-16">
                        <ShoppingCart className="w-12 h-12 text-[#5A606A] mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-white">Tidak ada data pesanan</h3>
                        <p className="text-xs text-[#8F96A0] mt-1">
                            Belum ada pesanan yang sesuai dengan filter saat ini.
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map((order) => {
                            const isPending = order.status === 'pending';
                            const isConfirmed = order.status === 'confirmed';
                            const isCancelled = order.status === 'cancelled';

                            // Clean phone for whatsapp
                            const cleanPhone = (order.customer_phone || '').replace(/[^0-9]/g, '');
                            const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : cleanPhone;

                            return (
                                <Card
                                    key={order.id}
                                    className="p-5 bg-[#181A1D] border-[#2A2E35] flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                                >
                                    {/* Order Info */}
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="font-mono text-sm font-bold text-[#F6851B]">
                                                {order.order_code}
                                            </span>
                                            <span className="text-xs text-[#5A606A]">
                                                {new Date(order.created_at).toLocaleString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                            <div>
                                                {isPending && <Badge variant="warning">Menunggu Konfirmasi</Badge>}
                                                {isConfirmed && <Badge variant="success">Dikonfirmasi (Stok Terpotong)</Badge>}
                                                {isCancelled && <Badge variant="danger">Dibatalkan</Badge>}
                                            </div>
                                        </div>

                                        {/* Customer Info */}
                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#BBC0C5]">
                                            <span className="font-semibold text-white flex items-center gap-1.5">
                                                👤 {order.customer_name}
                                            </span>
                                            <a
                                                href={`https://wa.me/${waPhone}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#28A745] hover:underline flex items-center gap-1 font-medium"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                <span>{order.customer_phone}</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                            {order.notes && (
                                                <span className="text-[#8F96A0] italic">
                                                    Catatan: "{order.notes}"
                                                </span>
                                            )}
                                        </div>

                                        {/* Items Ordered */}
                                        <div className="p-3 rounded-xl bg-[#121416] border border-[#262A30] text-xs">
                                            <span className="text-[10px] uppercase font-semibold text-[#8F96A0] block mb-1">
                                                Menu Dipesan:
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {order.items?.map((item) => (
                                                    <span
                                                        key={item.id}
                                                        className="px-2.5 py-1 rounded-lg bg-[#1E2126] border border-[#2F343C] text-white flex items-center gap-1.5"
                                                    >
                                                        <span className="text-[#F6851B] font-bold">{item.quantity}x</span>
                                                        <span>{item.drink_name}</span>
                                                        <span className="text-[#8F96A0]">({item.formatted_subtotal})</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price and Actions */}
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#262A30]">
                                        <div className="text-left sm:text-right">
                                            <span className="text-[10px] uppercase font-semibold text-[#8F96A0] block">
                                                Total Tagihan
                                            </span>
                                            <span className="text-xl font-bold text-white">
                                                {order.formatted_total_price}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2">
                                            {isPending && (
                                                <>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => setConfirmModalOrder(order)}
                                                        className="font-bold shadow-[0_2px_10px_rgba(246,133,27,0.3)]"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        <span>Konfirmasi Pesanan</span>
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setCancelModalOrder(order)}
                                                        className="text-xs text-[#8F96A0] hover:text-[#FF6B7A]"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        <span>Batal</span>
                                                    </Button>
                                                </>
                                            )}

                                            {isConfirmed && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-[#48D168] flex items-center gap-1 font-medium">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>Selesai & Stok Berkurang</span>
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setCancelModalOrder(order)}
                                                        title="Batalkan dan pulihkan stok"
                                                        className="text-[11px] text-[#8F96A0] hover:text-[#FF6B7A]"
                                                    >
                                                        Batal
                                                    </Button>
                                                </div>
                                            )}

                                            {isCancelled && (
                                                <span className="text-xs text-[#8F96A0] flex items-center gap-1">
                                                    <XCircle className="w-4 h-4 text-[#FF6B7A]" />
                                                    <span>Pesanan Dibatalkan</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {orders.links && orders.links.length > 3 && (
                    <div className="flex items-center justify-center gap-2 pt-6">
                        {orders.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                preserveScroll
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    link.active
                                        ? 'bg-[#F6851B] text-white'
                                        : link.url
                                        ? 'bg-[#181A1D] text-[#8F96A0] hover:text-white border border-[#2B2F36]'
                                        : 'opacity-40 cursor-not-allowed text-[#5A606A]'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Modal Dialog */}
            <Modal
                isOpen={!!confirmModalOrder}
                onClose={() => setConfirmModalOrder(null)}
                title="Konfirmasi Pesanan & Potong Stok"
                maxWidth="max-w-md"
            >
                {confirmModalOrder && (
                    <div className="space-y-4 py-2">
                        <div className="p-3.5 rounded-2xl bg-[#F6851B]/15 border border-[#F6851B]/30 text-xs text-[#BBC0C5] flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-[#F6851B] shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-white block mb-0.5">Perhatian:</span>
                                Mengonfirmasi pesanan ini akan <strong>otomatis mengurangi stok</strong> masing-masing minuman di database secara realtime.
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[#1A1D21] border border-[#2B2F36] space-y-1.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-[#8F96A0]">Kode Pesanan:</span>
                                <span className="font-mono font-bold text-white">{confirmModalOrder.order_code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#8F96A0]">Nama Pemesan:</span>
                                <span className="font-semibold text-white">{confirmModalOrder.customer_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#8F96A0]">Total Tagihan:</span>
                                <span className="font-bold text-[#F6851B]">{confirmModalOrder.formatted_total_price}</span>
                            </div>
                        </div>

                        <div className="space-y-1 text-xs">
                            <span className="text-[#8F96A0] font-medium block">Rincian pemotongan stok:</span>
                            <ul className="space-y-1">
                                {confirmModalOrder.items?.map((item) => (
                                    <li key={item.id} className="flex justify-between text-white py-1 border-b border-[#262A30]">
                                        <span>{item.drink_name}</span>
                                        <span className="font-bold text-[#FF6B7A]">-{item.quantity} unit</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-[#262A30]">
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => setConfirmModalOrder(null)}
                                className="flex-1"
                            >
                                Kembali
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={executeConfirmOrder}
                                disabled={processingAction}
                                className="flex-1 font-bold shadow-[0_4px_16px_rgba(246,133,27,0.35)]"
                            >
                                {processingAction ? 'Memproses...' : 'Ya, Konfirmasi & Potong Stok'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Cancel Modal Dialog */}
            <Modal
                isOpen={!!cancelModalOrder}
                onClose={() => setCancelModalOrder(null)}
                title="Batalkan Pesanan"
                maxWidth="max-w-md"
            >
                {cancelModalOrder && (
                    <div className="space-y-4 py-2">
                        <p className="text-xs text-[#BBC0C5]">
                            Apakah Anda yakin ingin membatalkan pesanan <span className="font-mono text-[#F6851B] font-bold">{cancelModalOrder.order_code}</span>?
                            {cancelModalOrder.status === 'confirmed' && (
                                <span className="block mt-1 text-[#48D168]">
                                    (Stok minuman yang sudah terpotong akan dikembalikan ke database).
                                </span>
                            )}
                        </p>

                        <div className="flex items-center gap-3 pt-4 border-t border-[#262A30]">
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => setCancelModalOrder(null)}
                                className="flex-1"
                            >
                                Tutup
                            </Button>
                            <Button
                                variant="danger"
                                size="md"
                                onClick={executeCancelOrder}
                                disabled={processingAction}
                                className="flex-1 font-bold"
                            >
                                {processingAction ? 'Membatalkan...' : 'Batalkan Pesanan'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
