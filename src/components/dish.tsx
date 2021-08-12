import React from 'react';
import { restaurant_restaurant_restaurant_menu_options } from '../__generated__/restaurant';

interface IDishProps {
  id?: number;
  name: string;
  description: string;
  price: number;
  isCustomer?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  orderStarted?: boolean;
  addItemToOrder?: (dishId: number) => void;
  isSelected?: boolean;
  removeFromOrder?: (dishId: number) => void;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  name,
  price,
  description,
  options,
  isCustomer = false,
  isSelected = false,
  orderStarted = false,
  addItemToOrder,
  removeFromOrder,
  children: dishOptions,
}): JSX.Element => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }

      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };

  return (
    <div
      className={`px-8 py-4 border cursor-pointer  transition-all ${
        isSelected ? 'border-gray-800' : 'hover:border-gray-800'
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium">
          {name}
          {orderStarted && (
            <button onClick={onClick}>{isSelected ? 'Remove' : 'Add'}</button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="my-3 mt-5 font-medium">Dish Options:</h5>
          {dishOptions}
        </div>
      )}
    </div>
  );
};
