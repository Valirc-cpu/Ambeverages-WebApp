import React from 'react';
import Modal from '../Modal';
import Button from '../Button';

export default function DeleteDrinkModal({
    drink,
    onClose,
    onConfirmDelete,
}) {
    if (!drink) return null;

    return (
        <Modal
            isOpen={!!drink}
            onClose={onClose}
            title="Hapus Menu Minuman"
            maxWidth="max-w-md"
        >
            <div className="space-y-4 py-2">
                <p className="text-xs text-[#4B5563] dark:text-[#9CA3AF]">
                    Apakah Anda yakin ingin menghapus <strong className="text-[#121417] dark:text-white">{drink.name}</strong> dari daftar menu? Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-[#F0F2F5] dark:border-[#282C34]">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={onClose}
                        className="flex-1 dark:bg-[#1A1D24] dark:border-[#282C34] dark:text-white"
                    >
                        Batal
                    </Button>
                    <Button
                        variant="danger"
                        size="md"
                        onClick={onConfirmDelete}
                        className="flex-1 font-bold"
                    >
                        Hapus Sekarang
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
