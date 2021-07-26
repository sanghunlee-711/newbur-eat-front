import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useParams } from 'react-router';
import {
  CATEGORY_FRAGMENT,
  PAGINATION_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from '../../fragments';
import { category, categoryVariables } from '../../__generated__/category';

interface ICategoryParams {
  slug: string;
}

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ...PaginationParts

      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${PAGINATION_FRAGMENT}
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Category = () => {
  const params = useParams<ICategoryParams>();
  const { data, loading, error } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: 1,
          slug: params.slug,
        },
      },
    }
  );

  console.log(data, loading, error);

  return (
    <div>
      <h1>category</h1>
    </div>
  );
};
