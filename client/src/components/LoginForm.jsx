import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
	const [formState, setFormState] = useState({ email: '', password: '' });
	const [login, { error, data }] = useMutation(LOGIN_USER);

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		try {
			const { data } = await login({
				variables: { ...formState },
			});
			Auth.login(data.login.token);
		} catch (e) {
			console.error(e);
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	return (
		<div className="login">
			<h2>Log In</h2>
			<form onSubmit={handleFormSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email address:</label>
					<input
						className="form-input"
						placeholder="Email"
						name="email"
						type="email"
						id="email"
						onChange={handleChange}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="pwd">Password:</label>
					<input
						className="form-input"
						placeholder="Password"
						name="password"
						type="password"
						id="pwd"
						onChange={handleChange}
					/>
				</div>
				<button className="form-btn" type="submit" style={{ cursor: 'pointer'}}>
					Submit
				</button>
			</form>
			{error && <div>Login failed</div>}
		</div>
	);
}

export default LoginForm;