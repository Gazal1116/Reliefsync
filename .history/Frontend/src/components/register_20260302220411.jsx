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
		<main className="min-h-screen flex items-center justify-center px-4 py-12">
			<section className="w-full max-w-lg card-surface rounded-2xl p-8 shadow-lg">
				<header>
					<h1 className="text-2xl font-semibold" style={{ color: 'var(--text-high)' }}>Create an account</h1>
					<p className="mt-2 text-sm" style={{ color: 'var(--text-mid)' }}>
						Create your ReliefSync account to request and manage relief efforts.
					</p>
				</header>

				<form className="mt-6" onSubmit={handleSubmit} noValidate>
					<div className="space-y-4">
						<label className="block">
							<span className="text-sm" style={{ color: 'var(--text-mid)' }}>Full name</span>
							<input
								name="name"
								value={form.name}
								onChange={handleChange}
								placeholder="Your full name"
								aria-label="Full name"
								className="mt-1 w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2"
								style={{ backgroundColor: 'var(--elev)', borderColor: 'var(--border)', color: 'var(--text-high)' }}
								required
							/>
						</label>

						<label className="block">
							<span className="text-sm" style={{ color: 'var(--text-mid)' }}>Email</span>
							<input
								name="email"
								type="email"
								value={form.email}
								onChange={handleChange}
								placeholder="you@example.com"
								aria-label="Email address"
								className="mt-1 w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2"
								style={{ backgroundColor: 'var(--elev)', borderColor: 'var(--border)', color: 'var(--text-high)' }}
								required
							/>
						</label>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<label className="block">
								<span className="text-sm" style={{ color: 'var(--text-mid)' }}>Password</span>
								<input
									name="password"
									type="password"
									value={form.password}
									onChange={handleChange}
									placeholder="Enter password"
									aria-label="Password"
									className="mt-1 w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2"
									style={{ backgroundColor: 'var(--elev)', borderColor: 'var(--border)', color: 'var(--text-high)' }}
									required
								/>
							</label>

							<label className="block">
								<span className="text-sm" style={{ color: 'var(--text-mid)' }}>Confirm</span>
								<input
									name="confirm"
									type="password"
									value={form.confirm}
									onChange={handleChange}
									placeholder="Repeat password"
									aria-label="Confirm password"
									className="mt-1 w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2"
									style={{ backgroundColor: 'var(--elev)', borderColor: 'var(--border)', color: 'var(--text-high)' }}
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
							className="w-full py-2 rounded-md btn-primary mt-1 disabled:opacity-70"
							disabled={loading}
						>
							{loading ? 'Creating...' : 'Create account'}
						</button>

						<div className="text-center text-sm mt-3">
							<a href="/login" className="link-accent hover:underline" style={{ color: 'var(--accent)' }}>
								Already have an account? Log in
							</a>
						</div>
					</div>
				</form>
			</section>
		</main>
	);
}

