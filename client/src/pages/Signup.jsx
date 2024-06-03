import { Navigate } from 'react-router-dom';

import Auth from '../utils/auth';
import SignUpForm from '../components/SignupForm';

const Login = () => {

	const loggedIn  =  Auth.loggedIn();

	return (
		<div className="login">
			{loggedIn ? <Navigate to="/profile" /> : <SignUpForm />}
			<a href="/login">Log In</a>
		</div>
	);
}

export default Login;