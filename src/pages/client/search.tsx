import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useLocation } from 'react-router';
import { PaginationBottom } from '../../components/pagination-bottom';
import { RestaurantsGrid } from '../../components/restaurants-grid';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { RestaurantParts } from '../../__generated__/RestaurantParts';
import {
  searchRestaurant,
  searchRestaurantVariables,
} from '../../__generated__/searchRestaurant';

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      # 중복되게 불러야하는 쿼리를 fragment로 따로 만들어서 사용하는 방법
      restaurants {
        ...RestaurantParts
      }
    }
  }
  # 중복되게 불러야하는 쿼리를 fragment로 따로 만들어서 사용하는 방법
  ${RESTAURANT_FRAGMENT}
`;

export const Search: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [queryReadyToStart, { loading, error, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  const [page, setPage] = useState(1);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  //레이지 쿼리는 실행하는 함수를 반환해주고 나머지는 useQuery랑 똑같이 넘겨주게 됨
  useEffect(() => {
    const [_, query] = location.search.split('?term=');
    if (!query) {
      return history.replace('/');
      //replace를 사용하면 브라우저의 history기록에 저장되지 않기 때문에
      // 뒤로가기를 눌러도 Replace되기 전 주소가 아닌 그 전의 주소로 가게됨
      //push의 경우 브라우저의 history의 기록에 저장되기 때문에 뒤로가기를 누르면 다시 넘어갈 수 있게됨
    }

    queryReadyToStart({
      variables: {
        input: {
          page,
          query,
        },
      },
    });
  }, [history, location, page]);

  console.log(loading, data?.searchRestaurant.restaurants, called);

  return (
    <React.Fragment>
      <Helmet>
        <title>Search | NewberEats</title>
      </Helmet>
      <div className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <span className="font-mono  text-white	text-3xl">
          Result with: {location.search.split('?term=')[1]}
        </span>
      </div>
      <RestaurantsGrid
        data={data?.searchRestaurant.restaurants as [RestaurantParts]}
      />
      <PaginationBottom
        totalPages={data?.searchRestaurant.totalPages}
        page={page}
        onNextPageClick={onNextPageClick}
        onPrevPageClick={onPrevPageClick}
      />
    </React.Fragment>
  );
};
