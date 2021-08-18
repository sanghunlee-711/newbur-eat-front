import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { Category } from '../pages/client/category';
import { RestaurantDetail } from '../pages/client/restaurant-detail';
import { Restaurants } from '../pages/client/restaurants';
import { Search } from '../pages/client/search';
import { Dashboard } from '../pages/driver/dashboard';
import { Order } from '../pages/order';
import { AddDish } from '../pages/owner/add-dish';
import { AddRestaurants } from '../pages/owner/add-restaurants';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { EditProfile } from '../pages/user/edit-profile';
import { UserRole } from '../__generated__/globalTypes';

const clientRoutes = [
  {
    path: '/',
    component: <Restaurants />,
  },
  {
    path: '/search',
    component: <Search />,
  },
  {
    path: '/category/:slug',
    component: <Category />,
  },
  {
    path: '/restaurants/:id',
    component: <RestaurantDetail />,
  },
];

const driverRoutes = [{ path: '/', component: <Dashboard /> }];

const restaurantRoutes = [
  { path: '/', component: <MyRestaurants /> },
  { path: '/add-restaurant', component: <AddRestaurants /> },
  { path: '/restaurants/:id', component: <MyRestaurant /> },
  { path: '/restaurants/:restaurantId/add-dish', component: <AddDish /> },
];

const commonRoutes = [
  {
    path: '/confirm',
    component: <RestaurantDetail />,
  },
  {
    path: '/edit-profile',
    component: <EditProfile />,
  },
  {
    path: '/orders/:id',
    component: <Order />,
  },
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
        {data?.me.role === UserRole.Client &&
          clientRoutes.map(({ path, component }) => (
            <Route exact key={path} path={path}>
              {component}
            </Route>
          ))}
        {data?.me.role === UserRole.Owner &&
          restaurantRoutes.map(({ path, component }) => (
            <Route exact key={path} path={path}>
              {component}
            </Route>
          ))}
        {data?.me.role === UserRole.Delivery &&
          driverRoutes.map(({ path, component }) => (
            <Route exact key={path} path={path}>
              {component}
            </Route>
          ))}

        {commonRoutes.map(({ path, component }) => (
          <Route exact key={path} path={path}>
            {component}
          </Route>
        ))}

        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
