import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Restaurant } from '../../components/restaurant';
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from '../../__generated__/restaurantsPageQuery';

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurants = () => {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  console.log(data);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          type="Search"
          placeholder="Search restaurant..."
          className="input rounded-md w-3/12 border-0"
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          <div className="flex justify-around  mx-w-sm mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <div
                className="flex flex-col items-center cursor-pointer group"
                key={category.name}
              >
                <div
                  className="w-16 h-16 bg-cover rounded-full  group-hover:bg-gray-100 "
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                ></div>
                <span className="text-sm text-center font-medium mt-1">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          <div className="grid mt-16 grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.name + restaurant.id}
                id={restaurant.id + ''}
                name={restaurant.name}
                coverImg={restaurant.coverImg}
                categoryName={restaurant.category?.name || ''}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md item-center mx-auto">
            {page > 1 ? (
              <button
                className="focus:outline-none font-medium text-2xl"
                onClick={onPrevPageClick}
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}

            <span className="mx-5">
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                className="focus:outline-none font-medium text-2xl"
                onClick={onNextPageClick}
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
      <div></div>
    </div>
  );
};
