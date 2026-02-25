import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="gradient-bg py-24 px-6">
                <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                        Share More,<br />Spend Less
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
                        BorrowBay connects students and departments to share equipment, tools, and resources across campus.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link to="/browse" className="px-8 py-3 bg-white text-[var(--color-primary)] font-bold rounded-xl hover:scale-105 transition-transform no-underline text-lg">
                            Browse Items
                        </Link>
                        <Link to="/login" className="px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition no-underline text-lg">
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-6 bg-[var(--color-surface)]">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { num: '500+', label: 'Items Shared' },
                        { num: '1,200+', label: 'Students Connected' },
                        { num: '₹2L+', label: 'Money Saved' },
                    ].map((stat) => (
                        <div key={stat.label} className="glass rounded-2xl p-8">
                            <div className="text-4xl font-black text-[var(--color-primary)]">{stat.num}</div>
                            <div className="text-[var(--color-text-muted)] mt-2">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="py-16 px-6 bg-[var(--color-surface-light)]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '1', icon: '🔍', title: 'Browse', desc: 'Search available equipment, tools, and lab gear.' },
                            { step: '2', icon: '📋', title: 'Request', desc: 'Submit a borrow request with your desired dates.' },
                            { step: '3', icon: '✅', title: 'Borrow', desc: 'Pick up your item once approved by the owner.' },
                        ].map((s) => (
                            <div key={s.step} className="text-center">
                                <div className="text-5xl mb-4">{s.icon}</div>
                                <div className="text-sm text-[var(--color-primary)] font-bold mb-2">STEP {s.step}</div>
                                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                                <p className="text-[var(--color-text-muted)]">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-6 bg-[var(--color-surface)]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { icon: '🔐', title: 'Role-Based Access', desc: 'Students, departments, and admins each have tailored views.' },
                            { icon: '📅', title: 'Due Date Tracking', desc: 'Never miss a return date with overdue alerts.' },
                            { icon: '⚡', title: 'Instant Availability', desc: 'Item status updates automatically when borrowed or returned.' },
                            { icon: '🔎', title: 'Search & Filter', desc: 'Find what you need with powerful search and category filters.' },
                        ].map((f) => (
                            <div key={f.title} className="glass rounded-xl p-6 flex gap-4 items-start">
                                <span className="text-3xl">{f.icon}</span>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                                    <p className="text-[var(--color-text-muted)] text-sm">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="gradient-bg py-16 px-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to start sharing?</h2>
                <Link to="/login" className="inline-block px-8 py-3 bg-white text-[var(--color-primary)] font-bold rounded-xl hover:scale-105 transition-transform no-underline text-lg">
                    Join BorrowBay
                </Link>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 text-center text-[var(--color-text-muted)] text-sm bg-[var(--color-surface)]">
                © 2026 BorrowBay — Built for campus communities
            </footer>
        </div>
    );
}
