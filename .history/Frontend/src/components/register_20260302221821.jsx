import React, { useState } from 'react';

export default function Register() {
	const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		if (!form.name || !form.email || !form.password) {
			setError('Please fill all required fields.');
			return;
		}
		if (form.password !== form.confirm) {
			setError('Passwords do not match.');
			return;
		}
		setLoading(true);
		try {
			// TODO: replace with real API call to backend
			console.log('Register payload', form);
			await new Promise((r) => setTimeout(r, 700));
			// success flow (redirect or toast) goes here
		} catch (err) {
			setError('Registration failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-screen flex items-center justify-center px-4 py-12 bg-bg">
			<section className="w-full max-w-lg bg-surface border border-border rounded-xl p-8 shadow-soft-dark">
				{/* header with logo */}
				<div className="flex items-center gap-3 mb-4">
					<div className="w-12 h-12 flex items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-accent/20">
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
							<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#g)" />
							<defs>
								<linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
									<stop offset="0" stopColor="#7C5CFF" />
									<stop offset="1" stopColor="#00D1B2" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					<div>
						<h2 className="text-xl font-semibold text-text-high">ReliefSync</h2>
						<p className="text-sm mt-0.5 text-text-mid">Secure relief coordination</p>
					</div>
				</div>

				<hr className="border-t" style={{ borderColor: 'rgba(255,255,255,0.03)', marginTop: 8, marginBottom: 14 }} />

				<form className="mt-6" onSubmit={handleSubmit} noValidate>
					<div className="grid gap-4">
						<label className="block">
							<span className="text-sm text-text-mid">Full name</span>
							<input
								name="name"
								value={form.name}
								onChange={handleChange}
								placeholder="Your full name"
								aria-label="Full name"
								className="mt-1 w-full bg-transparent border-b border-border text-text-high py-3 px-0 focus:outline-none focus:border-primary"
								required
							/>
						</label>


						<label className="block">
							<span className="text-sm text-text-mid">Email</span>
							<input
								name="email"
								type="email"
								value={form.email}
								onChange={handleChange}
								placeholder="you@organization.org"
								aria-label="Email address"
								className="mt-1 w-full bg-transparent border-b border-border text-text-high py-3 px-0 focus:outline-none focus:border-primary"
								required
							/>
						</label>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<label className="block">
								<span className="text-sm text-text-mid">Password</span>
								<input
									name="password"
									type="password"
									value={form.password}
									onChange={handleChange}
									placeholder="Create a secure password"
									aria-label="Password"
									className="mt-1 w-full bg-transparent border-b border-border text-text-high py-3 px-0 focus:outline-none focus:border-primary"
									required
								/>
							</label>

							<label className="block">
								<span className="text-sm text-text-mid">Confirm</span>
								<input
									name="confirm"
									type="password"
									value={form.confirm}
									onChange={handleChange}
									placeholder="Repeat password"
									aria-label="Confirm password"
									className="mt-1 w-full bg-transparent border-b border-border text-text-high py-3 px-0 focus:outline-none focus:border-primary"
									required
								/>
							</label>
						</div>

						{error && (
							<div role="alert" className="text-sm" style={{ color: 'var(--error)' }}>
								{error}
							</div>
						)}

						<button
							type="submit"
							className="w-full py-3 rounded-md mt-1 flex items-center justify-center gap-2" 
							style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-fg)', boxShadow: '0 6px 18px rgba(12,17,31,0.45)', transition: 'transform .12s ease' }}
							disabled={loading}
							aria-busy={loading}
						>
							<span className="font-medium">{loading ? 'Creating account…' : 'Create account'}</span>
						</button>

						<div className="text-center text-sm mt-3" style={{ color: 'var(--text-mid)' }}>
							Already have an account? <a href="/login" className="link-accent font-medium" style={{ color: 'var(--accent)' }}>Log in</a>
						</div>

						<p className="text-xs text-center mt-4" style={{ color: 'var(--text-low)' }}>
							By creating an account you agree to our <a href="#" className="link-accent">Terms</a> and <a href="#" className="link-accent">Privacy Policy</a>.
						</p>
					</div>
				</form>
			</section>
		</main>
	);
}

