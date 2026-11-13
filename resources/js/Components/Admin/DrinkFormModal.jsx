import React from 'react';
import Modal from '../Modal';
import Button from '../Button';

export default function DrinkFormModal({
    isOpen,
    onClose,
    isEdit = false,
    form,
    onSubmit,
}) {
    const { data, setData, errors, processing } = form;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Data Minuman' : 'Tambah Menu Minuman Baru'}
            maxWidth="max-w-lg"
        >
            <form onSubmit={onSubmit} className="space-y-4 py-2">
                <div>
                    <label className="block text-xs font-bold text-[#4B5563] mb-1">
                        Nama Minuman <span className="text-[#D73A49]">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Contoh: MetaMask Nitro Cold Brew"
                        required
                        className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-sm outline-none"
                    />
                    {errors.name && (
                        <p className="text-xs text-[#D73A49] mt-1">{errors.name}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                            Kategori
                        </label>
                        <input
                            type="text"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            placeholder="Signature / Kopi"
                            className="w-full px-3.5 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                            Harga (Rp) <span className="text-[#D73A49]">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            placeholder="25000"
                            required
                            className="w-full px-3.5 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#4B5563] mb-1">
                            Stok Fisik <span className="text-[#D73A49]">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            placeholder="20"
                            required
                            className="w-full px-3.5 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#4B5563] mb-1">
                        URL Gambar Minuman (Opsional)
                    </label>
                    <input
                        type="url"
                        value={data.image_url}
                        onChange={(e) => setData('image_url', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#4B5563] mb-1">
                        Atau Unggah Berkas Gambar
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('image', e.target.files[0])}
                        className="w-full text-xs text-[#6B7280] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#121417] file:text-white hover:file:bg-[#2A2E35]"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#4B5563] mb-1">
                        Deskripsi Minuman
                    </label>
                    <textarea
                        rows={3}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Tuliskan komposisi rasa atau keunggulan menu..."
                        className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#DCE0E5] focus:border-[#FA4B00] rounded-xl text-[#121417] text-xs outline-none resize-none"
                    />
                </div>

                {isEdit && (
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs text-[#4B5563] cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-[#DCE0E5] text-[#FA4B00] focus:ring-0"
                            />
                            <span className="font-semibold">Tampilkan menu ini di katalog publik</span>
                        </label>
                    </div>
                )}

                <div className="flex items-center gap-3 pt-3 border-t border-[#F0F2F5]">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="orange"
                        size="md"
                        disabled={processing}
                        className="flex-1 font-bold shadow-[0_4px_16px_rgba(250,75,0,0.3)]"
                    >
                        {processing ? 'Menyimpan...' : isEdit ? 'Perbarui Minuman' : 'Simpan Minuman'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
