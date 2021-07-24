import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { Restaurants } from '../pages/client/restaurants';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';

const ClientRoutes = [
  <Route path="/" exact key={1}>
    <Restaurants />
  </Route>,
  <Route path="/confirm" exact key={2}>
    <ConfirmEmail />
  </Route>,
  <Route path="/edit-profile" exact key={3}>
    <EditProfile />
  </Route>,
];

export default function LoggedInRouter() {
  const { data, loading, error } = useMe();
  console.log(data?.me.role);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading ...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Switch>
        {data?.me.role === 'Client' && ClientRoutes}
        {/* <Redirect to="/" /> */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}
