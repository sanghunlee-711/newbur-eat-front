import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { LoggedInRouter } from './routers/logged-in-router';
import { LoggedOutRouter } from './routers/logged-out-router';

const IS_LOGGED_IN = gql`
  query isLoggedIn {
    isLoggedIn @client
  }
`;

function App() {
  const {
    data: { isLoggedIn },
  } = useQuery(IS_LOGGED_IN);
  console.log(isLoggedIn);
  return <>{isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />}</>;
}

export default App;
