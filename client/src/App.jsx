import React from 'react';
import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
import Game from '../src/pages/Game';
// import Leaderboard from './pages/Leaderboard';
// import Donate from './pages/Donate';
// import Success from './pages/Success';
// import Cancel from './pages/Cancel';
import Navbar from './components/NavigationBar';
import GameBox from './components/GameBox';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
	return (
	  <ApolloProvider client={client}>
		<Router>
		  <Navbar />
		  <Routes>
			<Route path="/" element={<GameBox />} />
			{/* <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} /> */}
          <Route path="/game" element={<Games />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
		  </Routes>
		</Router>
	  </ApolloProvider>
	);
  }
  
  export default App;

