import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { CategoriesLink } from '../../components/categories-links';
import { PaginationBottom } from '../../components/pagination-bottom';
import { RestaurantsGrid } from '../../components/restaurants-grid';
import {
  CATEGORY_FRAGMENT,
  PAGINATION_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from '../../fragments';
import { CategoryParts } from '../../__generated__/CategoryParts';
import { RestaurantParts } from '../../__generated__/RestaurantParts';
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
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ...PaginationParts
      results {
        ...RestaurantParts
      }
    }
  }
  ${CATEGORY_FRAGMENT}
  ${PAGINATION_FRAGMENT}
  ${RESTAURANT_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

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

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | NewberEats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
      >
        <input
          {...register('searchTerm', {
            required: true,
            min: 3,
          })}
          name="searchTerm" //이름 인터페이스 register네임 모두 같아야 작동
          type="Search"
          placeholder="Search restaurant..."
          className="input rounded-md border-0 w-3/4 md:w-3/12"
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          <CategoriesLink
            data={data?.allCategories.categories as [CategoryParts]}
          />
          <RestaurantsGrid
            data={data?.restaurants.results as [RestaurantParts]}
          />
          <PaginationBottom
            onPrevPageClick={onPrevPageClick}
            onNextPageClick={onNextPageClick}
            page={page}
            totalPages={data?.restaurants.totalPages}
          />
        </div>
      )}
      <div></div>
    </div>
  );
};
