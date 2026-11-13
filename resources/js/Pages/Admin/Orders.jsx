import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import Card from '../../Components/Card';
import OrderRowCard from '../../Components/Admin/OrderRowCard';
import ConfirmOrderModal from '../../Components/Admin/ConfirmOrderModal';
import CancelOrderModal from '../../Components/Admin/CancelOrderModal';
import {
    ShoppingCart,
    Clock,
    CheckCircle2,
    TrendingUp,
    Search
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
                        <h1 className="text-3xl font-extrabold text-[#121417] dark:text-white tracking-tight flex items-center gap-2.5">
                            <ShoppingCart className="w-7 h-7 text-[#FA4B00]" />
                            <span>Pesanan Masuk</span>
                        </h1>
                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1 font-medium">
                            Kelola pesanan pembeli dan lakukan konfirmasi untuk otomatis memotong stok minuman.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="flex items-center gap-4 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                        <div className="p-3.5 rounded-2xl bg-[#FFF3EB] dark:bg-[#2A180E] text-[#FA4B00]">
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

                    <Card className="flex items-center gap-4 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                        <div className="p-3.5 rounded-2xl bg-[#E8F8EE] dark:bg-[#142B1C] text-[#1EBE5D]">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                Pesanan Dikonfirmasi
                            </span>
                            <span className="text-2xl font-extrabold text-[#121417] dark:text-white">
                                {stats.confirmed_orders || 0}
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                        <div className="p-3.5 rounded-2xl bg-[#F0F5FF] dark:bg-[#152238] text-[#0066FF] dark:text-[#3B82F6]">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                Total Pesanan
                            </span>
                            <span className="text-2xl font-extrabold text-[#121417] dark:text-white">
                                {stats.total_orders || 0}
                            </span>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                        <div className="p-3.5 rounded-2xl bg-[#FAF0FF] dark:bg-[#281533] text-[#8F44E4] dark:text-[#A855F7]">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block">
                                Total Omset Penjualan
                            </span>
                            <span className="text-2xl font-extrabold text-[#121417] dark:text-white">
                                {stats.formatted_total_revenue || 'Rp 0'}
                            </span>
                        </div>
                    </Card>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Status Tabs Capsule */}
                    <div className="inline-flex items-center gap-1 bg-[#ECEFF2] dark:bg-[#181A20] p-1.5 rounded-full border border-[#DCE0E5] dark:border-[#282C34] overflow-x-auto scrollbar-none">
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
                                        ? 'bg-[#121417] dark:bg-[#FA4B00] text-white shadow-md'
                                        : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white'
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
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#181A20] border border-[#DCE0E5] dark:border-[#282C34] focus:border-[#FA4B00] rounded-full text-[#121417] dark:text-white placeholder-[#9CA3AF] text-xs outline-none shadow-sm transition-colors"
                        />
                    </form>
                </div>

                {/* Orders List */}
                {orders.data.length === 0 ? (
                    <Card className="text-center py-20 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                        <ShoppingCart className="w-14 h-14 text-[#CBD2D9] dark:text-[#3B424E] mx-auto mb-3" />
                        <h3 className="text-base font-bold text-[#121417] dark:text-white">Tidak ada data pesanan</h3>
                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                            Belum ada pesanan yang sesuai dengan filter saat ini.
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map((order) => (
                            <OrderRowCard
                                key={order.id}
                                order={order}
                                onOpenConfirm={setConfirmModalOrder}
                                onOpenCancel={setCancelModalOrder}
                            />
                        ))}
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
                                        ? 'bg-[#121417] dark:bg-[#FA4B00] text-white shadow-sm'
                                        : link.url
                                        ? 'bg-white dark:bg-[#15171C] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white border border-[#DCE0E5] dark:border-[#282C34]'
                                        : 'opacity-40 cursor-not-allowed text-[#CBD2D9] dark:text-[#3B424E]'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modular Confirm Modal */}
            <ConfirmOrderModal
                order={confirmModalOrder}
                onClose={() => setConfirmModalOrder(null)}
                onConfirm={executeConfirmOrder}
                processing={processingAction}
            />

            {/* Modular Cancel Modal */}
            <CancelOrderModal
                order={cancelModalOrder}
                onClose={() => setCancelModalOrder(null)}
                onConfirmCancel={executeCancelOrder}
                processing={processingAction}
            />
        </AdminLayout>
    );
}
