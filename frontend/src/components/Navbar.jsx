import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        onLogout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="glass sticky top-0 z-50 px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[var(--color-primary)] no-underline">
                    📦 BorrowBay
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/browse" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition no-underline">Browse</Link>
                    {user && (
                        <Link to="/dashboard" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition no-underline">Dashboard</Link>
                    )}
                    {user && (user.role === 'admin' || user.role === 'department') && (
                        <Link to="/admin" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition no-underline">Admin</Link>
                    )}

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-[var(--color-text-muted)]">
                                {user.username} <span className="text-xs px-2 py-0.5 bg-[var(--color-primary)] rounded-full text-white ml-1">{user.role}</span>
                            </span>
                            <button onClick={logout} className="px-4 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm cursor-pointer">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition text-sm no-underline">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile toggle */}
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl bg-transparent border-none text-[var(--color-text)] cursor-pointer">
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden mt-3 flex flex-col gap-3 pb-3">
                    <Link to="/browse" onClick={() => setMenuOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition no-underline">Browse</Link>
                    {user && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition no-underline">Dashboard</Link>}
                    {user && (user.role === 'admin' || user.role === 'department') && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition no-underline">Admin</Link>
                    )}
                    {user ? (
                        <button onClick={logout} className="text-left text-red-400 bg-transparent border-none cursor-pointer">Logout</button>
                    ) : (
                        <Link to="/login" onClick={() => setMenuOpen(false)} className="text-[var(--color-primary)] no-underline">Login</Link>
                    )}
                </div>
            )}
        </nav>
    );
}
