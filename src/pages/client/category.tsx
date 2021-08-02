import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import CategoryLink from '../../components/category-link';
import { PaginationBottom } from '../../components/pagination-bottom';
import { RestaurantsGrid } from '../../components/restaurants-grid';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { category, categoryVariables } from '../../__generated__/category';
import { CategoryParts } from '../../__generated__/CategoryParts';
import { RestaurantParts } from '../../__generated__/RestaurantParts';

export const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults

      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const params = useParams<ICategoryParams>();
  const [page, setPage] = useState(1);

  const [queryReadyToStart, { data, loading, error }] = useLazyQuery<
    category,
    categoryVariables
  >(CATEGORY_QUERY, {
    variables: {
      input: {
        page,
        slug: params.slug,
      },
    },
  });

  console.log('data', data);

  useEffect(() => {
    if (params.slug) {
      queryReadyToStart({
        variables: {
          input: {
            page,
            slug: params.slug,
          },
        },
      });
    }
  }, []);

  // useLazyQuery가 테스트할때 값을 return해주지 못하는 문제가 발생했음
  // https://github.com/apollographql/apollo-client/issues/6865
  // useEffect(() => {
  //   if (params.slug) {
  //     queryReadyToStart({
  //       variables: {
  //         input: {
  //           page,
  //           slug: params.slug,
  //         },
  //       },
  //     });
  //   }
  // }, []);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  return (
    <React.Fragment>
      <Helmet>
        <title>Category Search | NewberEats</title>
      </Helmet>
      <div className="bg-gray-200 w-full py-40 flex items-center justify-center">
        <span className="font-mono  text-black	text-3xl  mx-2">
          You've Searched with
        </span>
        <CategoryLink category={data?.category.category as CategoryParts} />
      </div>

      {/* <CategoriesLink data={data?.category.category as CategoryParts} /> */}
      <RestaurantsGrid data={data?.category.restaurants as [RestaurantParts]} />
      <PaginationBottom
        totalPages={data?.category.totalPages}
        page={page}
        onNextPageClick={onNextPageClick}
        onPrevPageClick={onPrevPageClick}
      />
    </React.Fragment>
  );
};
