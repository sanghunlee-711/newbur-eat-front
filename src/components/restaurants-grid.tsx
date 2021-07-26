import React from 'react';
import { restaurantsPageQuery } from '../__generated__/restaurantsPageQuery';
import { Restaurant } from './restaurant';

interface IProps {
  data: restaurantsPageQuery | undefined;
}

export const RestaurantsGrid: React.FC<IProps> = ({ data }) => {
  return (
    <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
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
  );
};
