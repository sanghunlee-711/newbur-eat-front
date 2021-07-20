import React from 'react';
import { isLoggedInVar } from '../apollo';

export default function LoggedInRouter() {
  const onClick = () => {
    isLoggedInVar(false);
  };

  return (
    <div>
      <h1>Logged In</h1>
      <button onClick={onClick}>Log Out</button>
    </div>
  );
}
