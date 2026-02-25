import { useState, useEffect } from 'react';
import { getRequests, returnItem as returnItemApi } from '../services/api';

export default function DashboardPage({ user }) {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    const fetchRequests = () => {
        setLoading(true);
        const params = {};
        if (filter) params.status = filter;
        getRequests(params)
            .then((res) => setRequests(res.data.requests))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchRequests(); }, [filter]);

    const handleReturn = async (id) => {
        try {
            await returnItemApi(id);
            setMsg('Item returned successfully!');
            fetchRequests();
        } catch (err) {
            setMsg(err.response?.data?.error || 'Failed to return');
        }
    };

    const isOverdue = (returnDate) => {
        return new Date(returnDate) < new Date(new Date().toISOString().split('T')[0]);
    };

    // Summary stats
    const pending = requests.filter((r) => r.approval_status === 'pending').length;
    const approved = requests.filter((r) => r.approval_status === 'approved').length;
    const overdue = requests.filter((r) => r.approval_status === 'approved' && isOverdue(r.return_date)).length;

    const statusColors = {
        pending: 'bg-yellow-500/20 text-yellow-400',
        approved: 'bg-green-500/20 text-green-400',
        rejected: 'bg-red-500/20 text-red-400',
        returned: 'bg-blue-500/20 text-blue-400',
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-[var(--color-text-muted)] mb-8">Welcome, {user.username}</p>

            {msg && (
                <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm mb-4">
                    {msg}
                    <button onClick={() => setMsg('')} className="ml-4 text-green-300 bg-transparent border-none cursor-pointer">✕</button>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="glass rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold text-yellow-400">{pending}</div>
                    <div className="text-sm text-[var(--color-text-muted)]">Pending</div>
                </div>
                <div className="glass rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold text-green-400">{approved}</div>
                    <div className="text-sm text-[var(--color-text-muted)]">Borrowed</div>
                </div>
                <div className="glass rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold text-red-400">{overdue}</div>
                    <div className="text-sm text-[var(--color-text-muted)]">Overdue</div>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {[
                    { val: '', label: 'All' },
                    { val: 'pending', label: 'Pending' },
                    { val: 'approved', label: 'Borrowed' },
                    { val: 'returned', label: 'Returned' },
                    { val: 'rejected', label: 'Rejected' },
                ].map((tab) => (
                    <button
                        key={tab.val}
                        onClick={() => setFilter(tab.val)}
                        className={`px-4 py-1.5 rounded-lg text-sm cursor-pointer transition border-none ${filter === tab.val ? 'bg-[var(--color-primary)] text-white' : 'bg-white/10 text-[var(--color-text-muted)] hover:bg-white/20'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Requests list */}
            {loading ? (
                <div className="text-center py-12 text-[var(--color-text-muted)]">Loading...</div>
            ) : requests.length === 0 ? (
                <div className="text-center py-12 text-[var(--color-text-muted)]">
                    <div className="text-5xl mb-4">📋</div>
                    <p>No borrow requests yet</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {requests.map((req) => (
                        <div key={req.id} className="glass rounded-xl p-5 animate-fade-in-up">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-bold">{req.item_name}</h3>
                                    <div className="text-sm text-[var(--color-text-muted)] mt-1">
                                        📅 {req.borrow_date} → {req.return_date}
                                    </div>
                                    {req.approval_status === 'approved' && isOverdue(req.return_date) && (
                                        <div className="text-red-400 text-sm mt-1 font-semibold">⚠️ OVERDUE</div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-3 py-1 rounded-full ${statusColors[req.approval_status]}`}>
                                        {req.approval_status}
                                    </span>
                                    {req.approval_status === 'approved' && (
                                        <button
                                            onClick={() => handleReturn(req.id)}
                                            className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm cursor-pointer border-none"
                                        >
                                            Return Item
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
