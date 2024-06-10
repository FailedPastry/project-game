import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignUpForm = () => {
	const [formState, setFormState] = useState({ username: '', email: '', password: '' });
	const [signUp, { error, data }] = useMutation(ADD_USER);
	const [errorMessage, setErrorMessage] = useState('');

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		if (!formState.username || !formState.email || !formState.password) {
			setErrorMessage('Please fill out all fields');
			return;
		}

		try {
			const { data } = await signUp({
				variables: { ...formState },
			});
			if (data && data.addUser.token) {
				Auth.login(data.addUser.token);
			} else {
				throw new Error('Sign Up failed');
			}
		} catch (e) {
			console.error(e);
			setErrorMessage('Sign Up failed');
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
			<h2>Sign Up</h2>
			<form onSubmit={handleFormSubmit}>
				<div className="form-group">
					<label htmlFor="username">Username:</label>
					<input
						className="form-input"
						placeholder="Username"
						name="username"
						type="text"
						id="username"
						onChange={handleChange}
					/>
				</div>
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
				<button className="btn" type="submit" style={{ cursor: 'pointer'}}>
					Submit
				</button>
			</form>
			{error && <div>Sign Up failed</div>}
		</div>
	);
}

export default SignUpForm;