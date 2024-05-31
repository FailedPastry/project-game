import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_SCORES = gql`
  query getScores {
    getScores {
      id
      user {
        username
      }
      score
    }
  }
`;

const Leaderboard = () => {
  const { loading, error, data } = useQuery(GET_SCORES);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (data) {
      setScores(data.getScores);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Leaderboard</h1>
      <ul>
        {scores.map(score => (
          <li key={score.id}>
            {score.user.username}: {score.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;