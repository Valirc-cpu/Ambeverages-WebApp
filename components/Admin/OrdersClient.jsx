'use client';

import React, { useState } from 'react';
import Card from '../Card';
import Button from '../Button';
import OrderRowCard from './OrderRowCard';
import ConfirmOrderModal from './ConfirmOrderModal';
import CancelOrderModal from './CancelOrderModal';
import { ShoppingCart, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function OrdersClient({ initialOrders = { data: [] }, initialStats = {} }) {
    const [orders, setOrders] = useState(initialOrders.data || []);
    const [stats, setStats] = useState(initialStats);
    const [currentStatus, setCurrentStatus] = useState('all');
    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [confirmModalOrder, setConfirmModalOrder] = useState(null);
    const [cancelModalOrder, setCancelModalOrder] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    // Filter orders locally
    const filteredOrders = orders.filter((order) => {
        const matchesStatus = currentStatus === 'all' || order.status === currentStatus;
        const q = search.toLowerCase();
        const matchesSearch =
            !q ||
            order.order_code?.toLowerCase().includes(q) ||
            order.customer_name?.toLowerCase().includes(q) ||
            order.customer_phone?.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.ceil(filteredOrders.length / perPage) || 1;
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * perPage, currentPage * perPage);

    const handleConfirmOrder = async () => {
        if (!confirmModalOrder) return;
        setIsConfirming(true);

        try {
            const res = await fetch(`/api/admin/orders/${confirmModalOrder.id}/confirm`, { method: 'POST' });
            if (!res.ok) {
                alert('Gagal mengonfirmasi pesanan.');
                setIsConfirming(false);
                return;
            }

            setOrders((prev) =>
                prev.map((o) => (o.id === confirmModalOrder.id ? { ...o, status: 'confirmed' } : o))
            );
            setConfirmModalOrder(null);
        } catch (err) {
            console.error('Error confirming order:', err);
            alert('Terjadi kesalahan jaringan.');
        } finally {
            setIsConfirming(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelModalOrder) return;
        setIsCancelling(true);

        try {
            const res = await fetch(`/api/admin/orders/${cancelModalOrder.id}/cancel`, { method: 'POST' });
            if (!res.ok) {
                alert('Gagal membatalkan pesanan.');
                setIsCancelling(false);
                return;
            }

            setOrders((prev) =>
                prev.map((o) => (o.id === cancelModalOrder.id ? { ...o, status: 'cancelled' } : o))
            );
            setCancelModalOrder(null);
        } catch (err) {
            console.error('Error cancelling order:', err);
            alert('Terjadi kesalahan jaringan.');
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div className="space-y-6 pt-2">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] dark:text-white tracking-tight flex items-center gap-2.5">
                    <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-[#FA4B00]" />
                    <span>Pesanan Masuk</span>
                </h1>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1 font-medium">
                    Pantau dan konfirmasi pesanan pelanggan WhatsApp secara realtime.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                    <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block mb-1">
                        Menunggu Konfirmasi
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#FA4B00]">
                        {orders.filter((o) => o.status === 'pending').length}
                    </span>
                </Card>

                <Card className="bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                    <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block mb-1">
                        Pesanan Dikonfirmasi
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#1EBE5D]">
                        {orders.filter((o) => o.status === 'confirmed').length}
                    </span>
                </Card>

                <Card className="bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                    <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block mb-1">
                        Total Pesanan
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#121417] dark:text-white">
                        {orders.length}
                    </span>
                </Card>

                <Card className="bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                    <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-[#9CA3AF] block mb-1">
                        Total Omset Penjualan
                    </span>
                    <span className="text-lg sm:text-2xl font-extrabold text-[#121417] dark:text-white truncate block">
                        Rp {orders.filter((o) => o.status === 'confirmed').reduce((s, o) => s + (Number(o.total_price) || 0), 0).toLocaleString('id-ID')}
                    </span>
                </Card>
            </div>

            {/* Status Tabs and Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                            onClick={() => {
                                setCurrentStatus(tab.id);
                                setCurrentPage(1);
                            }}
                            className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                currentStatus === tab.id
                                    ? 'bg-[#121417] dark:bg-[#FA4B00] text-white shadow-md'
                                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative min-w-[240px] sm:min-w-[280px]">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Cari kode order, nama pemesan..."
                        className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white dark:bg-[#181A20] border border-[#DCE0E5] dark:border-[#282C34] focus:border-[#FA4B00] rounded-full text-[#121417] dark:text-white placeholder-[#9CA3AF] text-xs outline-none shadow-sm transition-colors"
                    />
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <Card className="text-center py-16 sm:py-20 bg-white dark:bg-[#15171C] border-[#E5E8EC] dark:border-[#262A32]">
                    <ShoppingCart className="w-12 h-12 sm:w-14 sm:h-14 text-[#CBD2D9] dark:text-[#3B424E] mx-auto mb-3" />
                    <h3 className="text-sm sm:text-base font-bold text-[#121417] dark:text-white">Tidak ada data pesanan</h3>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                        Belum ada pesanan yang sesuai dengan filter saat ini.
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {paginatedOrders.map((order) => (
                        <OrderRowCard
                            key={order.id}
                            order={order}
                            onOpenConfirm={setConfirmModalOrder}
                            onOpenCancel={setCancelModalOrder}
                        />
                    ))}
                </div>
            )}

            {/* Responsive Pagination Bar */}
            {filteredOrders.length > 0 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#15171C] border border-[#E5E8EC] dark:border-[#262A32] shadow-xs text-xs">
                    <div className="text-[11px] sm:text-xs text-[#6B7280] dark:text-[#9CA3AF] text-center md:text-left">
                        Menampilkan <span className="font-extrabold text-[#121417] dark:text-white">{(currentPage - 1) * perPage + 1}</span> –{' '}
                        <span className="font-extrabold text-[#121417] dark:text-white">{Math.min(currentPage * perPage, filteredOrders.length)}</span> dari{' '}
                        <span className="font-extrabold text-[#121417] dark:text-white">{filteredOrders.length}</span> pesanan
                    </div>

                    <div className="flex items-center gap-2 text-[#6B7280] dark:text-[#9CA3AF]">
                        <span className="font-medium text-[11px] uppercase tracking-wider">Per Halaman:</span>
                        <div className="flex items-center gap-1 bg-[#F2F4F7] dark:bg-[#191C22] p-1 rounded-full border border-[#DCE0E5] dark:border-[#282C34]">
                            {[5, 10, 15, 25].map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => {
                                        setPerPage(val);
                                        setCurrentPage(1);
                                    }}
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

                    {/* Pagination Links */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="min-w-8 h-8 px-2.5 flex items-center justify-center rounded-xl text-xs font-bold bg-[#F7F8FA] dark:bg-[#191C22] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white border border-[#DCE0E5] dark:border-[#282C34] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                            <button
                                key={pg}
                                type="button"
                                onClick={() => setCurrentPage(pg)}
                                className={`min-w-8 h-8 px-2.5 flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    currentPage === pg
                                        ? 'bg-[#FA4B00] text-white shadow-xs'
                                        : 'bg-[#F7F8FA] dark:bg-[#191C22] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white border border-[#DCE0E5] dark:border-[#282C34]'
                                }`}
                            >
                                {pg}
                            </button>
                        ))}
                        <button
                            type="button"
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="min-w-8 h-8 px-2.5 flex items-center justify-center rounded-xl text-xs font-bold bg-[#F7F8FA] dark:bg-[#191C22] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#121417] dark:hover:text-white border border-[#DCE0E5] dark:border-[#282C34] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ConfirmOrderModal
                order={confirmModalOrder}
                onClose={() => setConfirmModalOrder(null)}
                onConfirm={handleConfirmOrder}
                processing={isConfirming}
            />

            <CancelOrderModal
                order={cancelModalOrder}
                onClose={() => setCancelModalOrder(null)}
                onConfirm={handleCancelOrder}
                processing={isCancelling}
            />
        </div>
    );
}
