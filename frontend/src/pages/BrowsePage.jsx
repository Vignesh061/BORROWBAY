import { useState, useEffect } from 'react';
import { getItems, getCategories, createBorrowRequest } from '../services/api';

export default function BrowsePage({ user }) {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);       // item to request
    const [returnDate, setReturnDate] = useState('');
    const [msg, setMsg] = useState('');

    const fetchItems = () => {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        getItems(params)
            .then((res) => setItems(res.data.items))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchItems(); }, [search, category]);
    useEffect(() => { getCategories().then((r) => setCategories(r.data.categories)).catch(() => { }); }, []);

    const handleRequest = async () => {
        if (!returnDate) return;
        try {
            await createBorrowRequest({
                item_id: modal.id,
                borrow_date: new Date().toISOString().split('T')[0],
                return_date: returnDate,
            });
            setMsg('Request submitted!');
            setModal(null);
            setReturnDate('');
            fetchItems();
        } catch (err) {
            setMsg(err.response?.data?.error || 'Failed');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Browse Equipment</h1>

            {msg && (
                <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm mb-4">
                    {msg}
                    <button onClick={() => setMsg('')} className="ml-4 text-green-300 bg-transparent border-none cursor-pointer">✕</button>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
                <input
                    placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 min-w-[200px] px-4 py-2 bg-[var(--color-surface-light)] border border-white/10 rounded-lg text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition"
                />
                <select
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2 bg-[var(--color-surface-light)] border border-white/10 rounded-lg text-[var(--color-text)] outline-none"
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Items grid */}
            {loading ? (
                <div className="text-center py-12 text-[var(--color-text-muted)]">Loading...</div>
            ) : items.length === 0 ? (
                <div className="text-center py-12 text-[var(--color-text-muted)]">
                    <div className="text-5xl mb-4">📦</div>
                    <p>No items found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="glass rounded-xl p-5 flex flex-col gap-3 animate-fade-in-up">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold">{item.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {item.status}
                                </span>
                            </div>
                            {item.description && <p className="text-sm text-[var(--color-text-muted)]">{item.description}</p>}
                            <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                                <span>📁 {item.category}</span>
                                <span>👤 {item.owner_name}</span>
                            </div>
                            {user && item.status === 'available' && (
                                <button
                                    onClick={() => setModal(item)}
                                    className="mt-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition text-sm cursor-pointer"
                                >
                                    Request to Borrow
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Borrow request modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setModal(null)}>
                    <div className="glass rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">Borrow: {modal.name}</h3>
                        <label className="block text-sm text-[var(--color-text-muted)] mb-2">Return Date</label>
                        <input
                            type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-text)] outline-none mb-4"
                        />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setModal(null)} className="px-4 py-2 bg-white/10 rounded-lg text-[var(--color-text-muted)] hover:bg-white/20 transition cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleRequest} disabled={!returnDate} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50 cursor-pointer">
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
