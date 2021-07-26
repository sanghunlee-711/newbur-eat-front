import gql from 'graphql-tag';

export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantParts on Restaurant {
    id
    name
    coverImg
    category {
      name
    }
    address
    isPromoted
  }
`;

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryParts on Category {
    id
    name
    coverImg
    slug
    restaurantCount
  }
`;

export const PAGINATION_FRAGMENT = gql`
  fragment PaginationParts on RestaurantsOutput {
    ok
    error
    totalPages
    totalResults
  }
`;
