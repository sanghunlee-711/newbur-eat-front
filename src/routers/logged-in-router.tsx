import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { Category } from '../pages/client/category';
import { RestaurantDetail } from '../pages/client/restaurant-detail';
import { Restaurants } from '../pages/client/restaurants';
import { Search } from '../pages/client/search';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';

const ClientRoutes = [
  <Route path="/" exact key={1}>
    <Restaurants />
  </Route>,
  <Route path="/confirm" key={2}>
    <ConfirmEmail />
  </Route>,
  <Route path="/edit-profile" key={3}>
    <EditProfile />
  </Route>,
  <Route path="/search" key={4}>
    <Search />
  </Route>,
  <Route path="/category/:slug" key={5}>
    <Category />
  </Route>,
  <Route path="/restaurants/:id" key={6}>
    <RestaurantDetail />
  </Route>,
];

export const LoggedInRouter = () => {
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
        <Redirect to="/" />
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
