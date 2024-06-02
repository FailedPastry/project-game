import { Navigate } from 'react-router-dom';

import Auth from '../utils/auth';
import LoginForm from '../components/LoginForm';

const Login = () => {

	const loggedIn  =  Auth.loggedIn();

	return (
		<div className="login">
			{loggedIn ? <Navigate to="/profile" /> : <LoginForm />}
		</div>
	);
}

export default Login;