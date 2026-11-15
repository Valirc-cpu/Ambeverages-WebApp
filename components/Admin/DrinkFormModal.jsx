import React, { useRef } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { Upload, X } from 'lucide-react';

export default function DrinkFormModal({
    isOpen,
    onClose,
    isEdit = false,
    form,
    onSubmit,
}) {
    const { data, setData, errors, processing } = form;
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Silakan pilih berkas gambar yang valid (JPG, PNG, atau WebP).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const maxDim = 1200;
                let { width, height } = img;
                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                let compressedDataUrl = canvas.toDataURL('image/webp', 0.85);
                if (!compressedDataUrl.startsWith('data:image/webp')) {
                    compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
                }

                setData('image_url', compressedDataUrl);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Data Minuman' : 'Tambah Menu Minuman Baru'}
            maxWidth="max-w-lg"
        >
            <form onSubmit={onSubmit} className="space-y-4 py-2">
                <div>
                    <label className="block text-xs font-bold text-[#4B5563] dark:text-[#9CA3AF] mb-1">
                        Nama Minuman <span className="text-[#D73A49]">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Contoh: Ambmanggo Sparkling Delight"
                        required
                        className="w-full px-4 py-2.5 bg-[#F7F8FA] dark:bg-[#1A1D23] border border-[#DCE0E5] dark:border-[#2C313B] focus:border-[#FA4B00] rounded-xl text-[#121417] dark:text-white text-sm outline-none transition-colors"
                    />
                    {errors.name && (
                        <p className="text-xs text-[#D73A49] mt-1">{errors.name}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-[#4B5563] dark:text-[#9CA3AF] mb-1">
                            Kategori
                        </label>
                        <input
                            type="text"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            placeholder="Ambmanggo / Amberry / Ambpinaple"
                            className="w-full px-3.5 py-2 bg-[#F7F8FA] dark:bg-[#1A1D23] border border-[#DCE0E5] dark:border-[#2C313B] focus:border-[#FA4B00] rounded-xl text-[#121417] dark:text-white text-xs outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#4B5563] dark:text-[#9CA3AF] mb-1">
                            Harga (Rp) <span className="text-[#D73A49]">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            placeholder="25000"
                            required
                            className="w-full px-3.5 py-2 bg-[#F7F8FA] dark:bg-[#1A1D23] border border-[#DCE0E5] dark:border-[#2C313B] focus:border-[#FA4B00] rounded-xl text-[#121417] dark:text-white text-xs outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#4B5563] dark:text-[#9CA3AF] mb-1">
                            Stok Fisik <span className="text-[#D73A49]">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            placeholder="20"
                            required
                            className="w-full px-3.5 py-2 bg-[#F7F8FA] dark:bg-[#1A1D23] border border-[#DCE0E5] dark:border-[#2C313B] focus:border-[#FA4B00] rounded-xl text-[#121417] dark:text-white text-xs outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Upload & Image Preview Section */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#4B5563] dark:text-[#9CA3AF]">
                        Foto / Berkas Gambar Minuman
                    </label>

                    {data.image_url ? (
                        <div className="relative rounded-2xl overflow-hidden border border-[#E5E8EC] dark:border-[#2C313B] bg-[#F7F8FA] dark:bg-[#1A1D23] p-2.5 flex items-center gap-3">
                            <img
                                src={data.image_url}
                                alt="Pratinjau Minuman"
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#E5E8EC] dark:border-[#2C313B] shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1EBE5D]/15 text-[#1EBE5D] mb-1">
                                    Gambar Terpasang
                                </span>
                                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] truncate font-medium">
                                    {data.image_url.startsWith('data:') ? 'Berkas gambar siap diunggah' : data.image_url}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setData('image_url', '');
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="p-2 rounded-xl text-[#6B7280] hover:text-[#D73A49] hover:bg-[#FEE2E2]/60 dark:hover:bg-[#3D1E24] transition-colors cursor-pointer shrink-0"
                                title="Hapus gambar"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {/* File Upload Button / Area */}
                            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#DCE0E5] dark:border-[#2C313B] hover:border-[#FA4B00] dark:hover:border-[#FA4B00] rounded-2xl bg-[#F7F8FA] dark:bg-[#1A1D23] cursor-pointer transition-colors text-center group">
                                <Upload className="w-6 h-6 text-[#9CA3AF] group-hover:text-[#FA4B00] mb-1.5 transition-colors" />
                                <span className="text-xs font-bold text-[#121417] dark:text-white">
                                    Pilih Gambar dari Perangkat
                                </span>
                                <span className="text-[10px] text-[#9CA3AF] mt-0.5">
                                    Mendukung JPG, PNG, WebP (otomatis dikompres & dioptimasi)
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>

                            {/* Or URL input */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] shrink-0">
                                    Atau URL:
                                </span>
                                <input
                                    type="url"
                                    value={data.image_url || ''}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 px-3 py-1.5 bg-[#F7F8FA] dark:bg-[#1A1D23] border border-[#DCE0E5] dark:border-[#2C313B] focus:border-[#FA4B00] rounded-xl text-[#121417] dark:text-white text-xs outline-none transition-colors"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-[#4B5563] dark:text-[#9CA3AF] mb-1">
                        Deskripsi Minuman
                    </label>
                    <textarea
                        rows={3}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Tuliskan komposisi rasa atau keunggulan menu..."
                        className="w-full px-4 py-2 bg-[#F7F8FA] dark:bg-[#1A1D23] border border-[#DCE0E5] dark:border-[#2C313B] focus:border-[#FA4B00] rounded-xl text-[#121417] dark:text-white text-xs outline-none resize-none transition-colors"
                    />
                </div>

                {isEdit && (
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs text-[#4B5563] dark:text-[#9CA3AF] cursor-pointer">
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

                <div className="flex items-center gap-3 pt-3 border-t border-[#F0F2F5] dark:border-[#24272D]">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={onClose}
                        className="flex-1 dark:bg-[#191C22] dark:border-[#2C313B] dark:text-white"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="orange"
                        size="md"
                        disabled={processing}
                        className="flex-1 font-bold shadow-sm"
                    >
                        {processing ? 'Menyimpan...' : isEdit ? 'Perbarui Minuman' : 'Simpan Minuman'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
