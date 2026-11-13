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
    Search,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function Orders({ orders = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [currentStatus, setCurrentStatus] = useState(filters.status || 'all');
    const [perPage, setPerPage] = useState(filters.per_page || 5);
    const [confirmModalOrder, setConfirmModalOrder] = useState(null);
    const [cancelModalOrder, setCancelModalOrder] = useState(null);
    const [processingAction, setProcessingAction] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/orders',
            { search, status: currentStatus, per_page: perPage },
            { preserveState: true, replace: true }
        );
    };

    const handleStatusTab = (status) => {
        setCurrentStatus(status);
        router.get(
            '/admin/orders',
            { search, status, per_page: perPage },
            { preserveState: true, replace: true }
        );
    };

    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        router.get(
            '/admin/orders',
            { search, status: currentStatus, per_page: newPerPage },
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
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-white tracking-tight flex items-center gap-2.5">
                            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-[#FA4B00]" />
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
                            <span className="text-xl sm:text-2xl font-extrabold text-[#FA4B00]">
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
                            <span className="text-xl sm:text-2xl font-extrabold text-[#121417] dark:text-white">
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
                            <span className="text-xl sm:text-2xl font-extrabold text-[#121417] dark:text-white">
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
                            <span className="text-lg sm:text-2xl font-extrabold text-[#121417] dark:text-white truncate block">
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
                                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all ${
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
                    <form onSubmit={handleSearch} className="relative min-w-[240px] sm:min-w-[280px]">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kode order, nama pemesan..."
                            className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white dark:bg-[#181A20] border border-[#DCE0E5] dark:border-[#282C34] focus:border-[#FA4B00] rounded-full text-[#121417] dark:text-white placeholder-[#9CA3AF] text-xs outline-none shadow-sm transition-colors"
                        />
                    </form>
                </div>

                {/* Orders List */}
                {orders.data.length === 0 ? (
                    <Card className="text-center py-16 sm:py-20 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                        <ShoppingCart className="w-12 h-12 sm:w-14 sm:h-14 text-[#CBD2D9] dark:text-[#3B424E] mx-auto mb-3" />
                        <h3 className="text-sm sm:text-base font-bold text-[#121417] dark:text-white">Tidak ada data pesanan</h3>
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

                {/* Full-featured Responsive Pagination Bar */}
                {orders.total > 0 && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#15171C] border border-[#E5E8EC] dark:border-[#262A32] shadow-xs text-xs">
                        {/* Left: Summary */}
                        <div className="text-[11px] sm:text-xs text-[#6B7280] dark:text-[#9CA3AF] text-center md:text-left">
                            Menampilkan <span className="font-extrabold text-[#121417] dark:text-white">{orders.from || 0}</span> – <span className="font-extrabold text-[#121417] dark:text-white">{orders.to || 0}</span> dari <span className="font-extrabold text-[#121417] dark:text-white">{orders.total || 0}</span> pesanan
                        </div>

                        {/* Center: Per page selector */}
                        <div className="flex items-center gap-2 text-[#6B7280] dark:text-[#9CA3AF]">
                            <span className="font-medium text-[11px] uppercase tracking-wider">Per Halaman:</span>
                            <div className="flex items-center gap-1 bg-[#F2F4F7] dark:bg-[#191C22] p-1 rounded-full border border-[#DCE0E5] dark:border-[#282C34]">
                                {[5, 10, 15, 25].map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => handlePerPageChange(val)}
                                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                            perPage === val
                                                ? 'bg-[#121417] dark:bg-[#FA4B00] text-white shadow-xs'
                                                : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white'
                                        }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Page navigation links */}
                        <div className="flex items-center gap-1.5 flex-wrap justify-center">
                            {orders.links && orders.links.map((link, idx) => {
                                const isPrev = idx === 0;
                                const isNext = idx === orders.links.length - 1;

                                return (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`min-w-8 h-8 px-2.5 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                                            link.active
                                                ? 'bg-[#FA4B00] text-white shadow-xs'
                                                : link.url
                                                ? 'bg-[#F7F8FA] dark:bg-[#191C22] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252932] border border-[#DCE0E5] dark:border-[#282C34]'
                                                : 'opacity-30 cursor-not-allowed bg-transparent text-[#9CA3AF]'
                                        }`}
                                    >
                                        {isPrev ? (
                                            <span className="flex items-center gap-1">
                                                <ChevronLeft className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline">Prev</span>
                                            </span>
                                        ) : isNext ? (
                                            <span className="flex items-center gap-1">
                                                <span className="hidden sm:inline">Next</span>
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </span>
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
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
