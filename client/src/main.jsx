import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.jsx'
import Home from './pages/Home.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Games from './pages/Games.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
	  {
		path: '/',
		element: <Home />
	  },
	  {
		path: '/login',
		element: <Login />
	  },
	  {
		path: '/signup',
		element: <Signup />
	  },
	  {
		path: '/games',
		element: <Games />
	  },
	  {
		path: '/leaderboard',
		element: <Leaderboard />
	  },
	  {
		path: '/profile',
		element: <Profile />
	  },
	  {
		path: '/profile/:userId',
		element: <Profile />
	  }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
