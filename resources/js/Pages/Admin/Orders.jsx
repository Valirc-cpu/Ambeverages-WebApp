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
    AlertTriangle,
    Check,
    X
} from 'lucide-react';

export default function Orders({ orders = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [currentStatus, setCurrentStatus] = useState(filters.status || 'all');
    const [confirmModalOrder, setConfirmModalOrder] = useState(null);
    const [cancelModalOrder, setCancelModalOrder] = useState(null);
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
                        <h1 className="text-3xl font-extrabold text-[#121417] tracking-tight flex items-center gap-2.5">
                            <ShoppingCart className="w-7 h-7 text-[#FA4B00]" />
                            <span>Pesanan Masuk</span>
                        </h1>
                        <p className="text-xs text-[#6B7280] mt-1 font-medium">
                            Kelola pesanan pembeli dan lakukan konfirmasi untuk otomatis memotong stok minuman.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="flex items-center gap-4 bg-white border-[#E5E8EC]">
                        <div className="p-3.5 rounded-2xl bg-[#FFF3EB] text-[#FA4B00]">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                Menunggu Konfirmasi
                            </span>
                            <span className="text-2xl font-extrabold text-[#FA4B00]">
                                {stats.pending_orders || 0}
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-white border-[#E5E8EC]">
                        <div className="p-3.5 rounded-2xl bg-[#E8F8EE] text-[#1EBE5D]">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                Pesanan Dikonfirmasi
                            </span>
                            <span className="text-2xl font-extrabold text-[#121417]">
                                {stats.confirmed_orders || 0}
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-white border-[#E5E8EC]">
                        <div className="p-3.5 rounded-2xl bg-[#F0F5FF] text-[#0066FF]">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                Total Pesanan
                            </span>
                            <span className="text-2xl font-extrabold text-[#121417]">
                                {stats.total_orders || 0}
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-white border-[#E5E8EC]">
                        <div className="p-3.5 rounded-2xl bg-[#FAF0FF] text-[#8F44E4]">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                Total Omset Penjualan
                            </span>
                            <span className="text-2xl font-extrabold text-[#121417]">
                                {stats.formatted_total_revenue || 'Rp 0'}
                            </span>
                        </div>
                    </Card>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Status Tabs Capsule */}
                    <div className="inline-flex items-center gap-1 bg-[#ECEFF2] p-1.5 rounded-full border border-[#DCE0E5] overflow-x-auto scrollbar-none">
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
                                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                    currentStatus === tab.id
                                        ? 'bg-[#121417] text-white shadow-md'
                                        : 'text-[#6B7280] hover:text-[#121417]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="relative min-w-[280px]">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kode order, nama pemesan..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DCE0E5] focus:border-[#FA4B00] rounded-full text-[#121417] placeholder-[#9CA3AF] text-xs outline-none shadow-sm"
                        />
                    </form>
                </div>

                {/* Orders List */}
                {orders.data.length === 0 ? (
                    <Card className="text-center py-20 bg-white">
                        <ShoppingCart className="w-14 h-14 text-[#CBD2D9] mx-auto mb-3" />
                        <h3 className="text-base font-bold text-[#121417]">Tidak ada data pesanan</h3>
                        <p className="text-xs text-[#6B7280] mt-1">
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
                                <div
                                    key={order.id}
                                    className="p-6 bg-white border border-[#E5E8EC] rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                                >
                                    {/* Order Info */}
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="font-mono text-sm font-extrabold text-[#FA4B00]">
                                                {order.order_code}
                                            </span>
                                            <span className="text-xs text-[#9CA3AF] font-medium">
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
                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#4B5563]">
                                            <span className="font-bold text-[#121417]">
                                                👤 {order.customer_name}
                                            </span>
                                            <a
                                                href={`https://wa.me/${waPhone}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#25D366] hover:underline flex items-center gap-1 font-bold"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                <span>{order.customer_phone}</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                            {order.notes && (
                                                <span className="text-[#6B7280] italic">
                                                    Catatan: "{order.notes}"
                                                </span>
                                            )}
                                        </div>

                                        {/* Items Ordered */}
                                        <div className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#E5E8EC] text-xs">
                                            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block mb-1.5 tracking-wider">
                                                Minuman yang Dipesan:
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {order.items?.map((item) => (
                                                    <span
                                                        key={item.id}
                                                        className="px-3 py-1 rounded-full bg-white border border-[#DCE0E5] text-[#121417] flex items-center gap-1.5 shadow-sm"
                                                    >
                                                        <span className="text-[#FA4B00] font-extrabold">{item.quantity}x</span>
                                                        <span className="font-semibold">{item.drink_name}</span>
                                                        <span className="text-[#6B7280]">({item.formatted_subtotal})</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price and Actions */}
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#F0F2F5]">
                                        <div className="text-left sm:text-right">
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                                Total Pembayaran
                                            </span>
                                            <span className="text-2xl font-extrabold text-[#121417]">
                                                {order.formatted_total_price}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2">
                                            {isPending && (
                                                <>
                                                    <Button
                                                        variant="orange"
                                                        size="sm"
                                                        onClick={() => setConfirmModalOrder(order)}
                                                        className="font-bold shadow-[0_4px_14px_rgba(250,75,0,0.25)]"
                                                    >
                                                        <Check className="w-4 h-4 stroke-[3]" />
                                                        <span>Konfirmasi Pesanan</span>
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setCancelModalOrder(order)}
                                                        className="text-xs text-[#6B7280] hover:text-[#D73A49]"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        <span>Batal</span>
                                                    </Button>
                                                </>
                                            )}

                                            {isConfirmed && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-[#1EBE5D] flex items-center gap-1 font-bold">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>Stok Terpotong Otomatis</span>
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setCancelModalOrder(order)}
                                                        title="Batalkan dan pulihkan stok"
                                                        className="text-[11px] text-[#6B7280] hover:text-[#D73A49]"
                                                    >
                                                        Batal
                                                    </Button>
                                                </div>
                                            )}

                                            {isCancelled && (
                                                <span className="text-xs text-[#6B7280] flex items-center gap-1 font-semibold">
                                                    <XCircle className="w-4 h-4 text-[#D73A49]" />
                                                    <span>Pesanan Dibatalkan</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
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
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                    link.active
                                        ? 'bg-[#121417] text-white shadow-sm'
                                        : link.url
                                        ? 'bg-white text-[#6B7280] hover:text-[#121417] border border-[#DCE0E5]'
                                        : 'opacity-40 cursor-not-allowed text-[#CBD2D9]'
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
                        <div className="p-4 rounded-2xl bg-[#FFF3EB] border border-[#FA4B00]/25 text-xs text-[#4B5563] flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-[#FA4B00] shrink-0 mt-0.5" />
                            <div>
                                <span className="font-extrabold text-[#121417] block mb-0.5">Konfirmasi Pesanan</span>
                                Mengonfirmasi pesanan ini akan <strong>otomatis mengurangi stok fisik</strong> masing-masing minuman di database secara realtime.
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E5E8EC] space-y-1.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-[#6B7280]">Kode Pesanan:</span>
                                <span className="font-mono font-extrabold text-[#121417]">{confirmModalOrder.order_code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#6B7280]">Nama Pemesan:</span>
                                <span className="font-bold text-[#121417]">{confirmModalOrder.customer_name}</span>
                            </div>
                            <div className="flex justify-between border-t border-[#E5E8EC] pt-1.5">
                                <span className="text-[#6B7280]">Total Pembayaran:</span>
                                <span className="font-extrabold text-[#FA4B00] text-sm">{confirmModalOrder.formatted_total_price}</span>
                            </div>
                        </div>

                        <div className="space-y-1 text-xs">
                            <span className="text-[#6B7280] font-bold block">Daftar item yang stoknya akan dipotong:</span>
                            <ul className="space-y-1">
                                {confirmModalOrder.items?.map((item) => (
                                    <li key={item.id} className="flex justify-between text-[#121417] py-1 border-b border-[#F0F2F5]">
                                        <span className="font-semibold">{item.drink_name}</span>
                                        <span className="font-bold text-[#D73A49]">-{item.quantity} unit</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-[#F0F2F5]">
                            <Button
                                variant="outline"
                                size="md"
                                onClick={() => setConfirmModalOrder(null)}
                                className="flex-1"
                            >
                                Kembali
                            </Button>
                            <Button
                                variant="orange"
                                size="md"
                                onClick={executeConfirmOrder}
                                disabled={processingAction}
                                className="flex-1 font-bold shadow-[0_4px_16px_rgba(250,75,0,0.3)]"
                            >
                                {processingAction ? 'Memproses...' : 'Ya, Konfirmasi & Potong'}
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
                        <p className="text-xs text-[#4B5563]">
                            Apakah Anda yakin ingin membatalkan pesanan <span className="font-mono text-[#FA4B00] font-bold">{cancelModalOrder.order_code}</span>?
                            {cancelModalOrder.status === 'confirmed' && (
                                <span className="block mt-2 font-bold text-[#1EBE5D]">
                                    (Stok minuman yang sebelumnya terpotong akan dikembalikan otomatis ke database).
                                </span>
                            )}
                        </p>

                        <div className="flex items-center gap-3 pt-4 border-t border-[#F0F2F5]">
                            <Button
                                variant="outline"
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
