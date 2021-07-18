import React from 'react';
import { LoggedInRouter } from './routers/logged-in-router';
import { LoggedOutRouter } from './routers/logged-out-router';

function App() {
  return (
    <>
    <LoggedOutRouter />
    <LoggedInRouter />
    </>
  );
}

export default App;
