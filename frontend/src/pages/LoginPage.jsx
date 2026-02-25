import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

export default function LoginPage({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ username: '', email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                const res = await registerUser(form);
                // Auto-login after registration
                const loginRes = await loginUser({ email: form.email, password: form.password });
                onLogin(loginRes.data.token, loginRes.data.user);
            } else {
                const res = await loginUser({ email: form.email, password: form.password });
                onLogin(res.data.token, res.data.user);
            }
            navigate('/browse');
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="glass rounded-2xl p-8 w-full max-w-md animate-fade-in-up">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isRegister ? 'Create Account' : 'Welcome Back'}
                </h2>

                {error && (
                    <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {isRegister && (
                        <input
                            name="username" placeholder="Username" value={form.username} onChange={handleChange} required
                            className="px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition"
                        />
                    )}
                    <input
                        name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required
                        className="px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition"
                    />
                    <input
                        name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required
                        className="px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition"
                    />

                    {isRegister && (
                        <select
                            name="role" value={form.role} onChange={handleChange}
                            className="px-4 py-3 bg-[var(--color-surface)] border border-white/10 rounded-lg text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition"
                        >
                            <option value="student">Student</option>
                            <option value="department">Department</option>
                            <option value="admin">Admin</option>
                        </select>
                    )}

                    <button
                        type="submit" disabled={loading}
                        className="px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-lg hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-[var(--color-text-muted)] text-sm mt-6">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => { setIsRegister(!isRegister); setError(''); }}
                        className="text-[var(--color-primary)] bg-transparent border-none cursor-pointer underline"
                    >
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
}
