import React from 'react';
import { RestaurantParts } from '../__generated__/RestaurantParts';
import { Restaurant } from './restaurant';

interface IProps {
  data: [RestaurantParts] | undefined | null;
}

export const RestaurantsGrid: React.FC<IProps> = ({ data }) => {
  return (
    <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
      {data?.map((restaurant) => (
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
