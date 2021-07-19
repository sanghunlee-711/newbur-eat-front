import { isLoggedInVar } from '../apollo';

export const LoggedOutRouter = () => {
  const onClick = () => {
    isLoggedInVar(true);
    console.log('..');
  };

  return (
    <div>
      <h1>Logged out</h1>
      <button onClick={onClick}>Click to login</button>
    </div>
  );
};
