import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { myRestaurants } from '../../__generated__/myRestaurants';

const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants: React.FC = (): JSX.Element => {
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);

  console.log(data);
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Newber Eats</title>
      </Helmet>
      <div className=" container mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok &&
          data.myRestaurants.restaurants?.length !== 0 && (
            <>
              <h4 className=" text-xl mb-5">You have no Restaurants!</h4>
              <Link className="link" to="/add-restaurant">
                Create One &rarr;
              </Link>
            </>
          )}
      </div>
    </div>
  );
};
