import { useState, useEffect } from 'react';
import { getRequests, getItems, approveRequest, createItem, deleteItem } from '../services/api';

export default function AdminPage({ user }) {
    const [tab, setTab] = useState('queue');
    const [requests, setRequests] = useState([]);
    const [items, setItems] = useState([]);
    const [msg, setMsg] = useState('');
    const [newItem, setNewItem] = useState({ name: '', description: '', category: '' });

    const fetchData = () => {
        getRequests().then((r) => setRequests(r.data.requests)).catch(() => { });
        getItems().then((r) => setItems(r.data.items)).catch(() => { });
    };

    useEffect(() => { fetchData(); }, []);

    const handleApproval = async (id, action) => {
        try {
            await approveRequest(id, action);
            setMsg(`Request ${action}d`);
            fetchData();
        } catch (err) {
            setMsg(err.response?.data?.error || 'Failed');
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.name) return;
        try {
            await createItem(newItem);
            setMsg('Item added!');
            setNewItem({ name: '', description: '', category: '' });
            fetchData();
        } catch (err) {
            setMsg(err.response?.data?.error || 'Failed to add item');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            await deleteItem(id);
            setMsg('Item deleted');
            fetchData();
        } catch (err) {
            setMsg(err.response?.data?.error || 'Failed to delete');
        }
    };

    const pendingReqs = requests.filter((r) => r.approval_status === 'pending');
    const processedReqs = requests.filter((r) => r.approval_status !== 'pending');

    const tabs = [
        { key: 'queue', label: `Approval Queue (${pendingReqs.length})` },
        { key: 'history', label: 'Request History' },
        { key: 'items', label: 'Manage Items' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
            <p className="text-[var(--color-text-muted)] mb-8">{user.role} — {user.username}</p>

            {msg && (
                <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm mb-4">
                    {msg}
                    <button onClick={() => setMsg('')} className="ml-4 text-green-300 bg-transparent border-none cursor-pointer">✕</button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-5 py-2 rounded-lg text-sm cursor-pointer transition border-none ${tab === t.key ? 'bg-[var(--color-primary)] text-white' : 'bg-white/10 text-[var(--color-text-muted)] hover:bg-white/20'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Approval Queue */}
            {tab === 'queue' && (
                <div className="flex flex-col gap-4">
                    {pendingReqs.length === 0 ? (
                        <div className="text-center py-12 text-[var(--color-text-muted)]">
                            <div className="text-5xl mb-4">✅</div>
                            <p>No pending requests</p>
                        </div>
                    ) : (
                        pendingReqs.map((req) => (
                            <div key={req.id} className="glass rounded-xl p-5 animate-fade-in-up">
                                <div className="flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{req.item_name}</h3>
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                            Requested by <strong>{req.borrower_name}</strong> · {req.borrow_date} → {req.return_date}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApproval(req.id, 'approve')} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition text-sm cursor-pointer border-none">
                                            ✓ Approve
                                        </button>
                                        <button onClick={() => handleApproval(req.id, 'reject')} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm cursor-pointer border-none">
                                            ✕ Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Request History */}
            {tab === 'history' && (
                <div className="flex flex-col gap-4">
                    {processedReqs.length === 0 ? (
                        <div className="text-center py-12 text-[var(--color-text-muted)]">No history yet</div>
                    ) : (
                        processedReqs.map((req) => (
                            <div key={req.id} className="glass rounded-xl p-5">
                                <div className="flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <h3 className="font-bold">{req.item_name}</h3>
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                            {req.borrower_name} · {req.borrow_date} → {req.return_date}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full ${req.approval_status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                            req.approval_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {req.approval_status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Manage Items */}
            {tab === 'items' && (
                <div>
                    {/* Add new item */}
                    <form onSubmit={handleAddItem} className="glass rounded-xl p-6 mb-8">
                        <h3 className="font-bold text-lg mb-4">Add New Item</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                placeholder="Item name *" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} required
                                className="px-4 py-2 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition"
                            />
                            <input
                                placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                className="px-4 py-2 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition"
                            />
                            <input
                                placeholder="Category" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                className="px-4 py-2 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition"
                            />
                        </div>
                        <button type="submit" className="mt-4 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition cursor-pointer">
                            Add Item
                        </button>
                    </form>

                    {/* Item list */}
                    <div className="flex flex-col gap-3">
                        {items.length === 0 ? (
                            <div className="text-center py-12 text-[var(--color-text-muted)]">No items yet. Add one above!</div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="glass rounded-xl p-4 flex flex-wrap justify-between items-center gap-3">
                                    <div>
                                        <h3 className="font-bold">{item.name}</h3>
                                        <p className="text-sm text-[var(--color-text-muted)]">{item.category} · {item.status}</p>
                                    </div>
                                    <button onClick={() => handleDelete(item.id)} className="px-4 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm cursor-pointer border-none">
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
