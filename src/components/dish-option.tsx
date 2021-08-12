import React from 'react';

interface IDishOptionPtops {
  isSelected: boolean;
  name: string;
  extra?: number | null;
  dishId: number;
  addOptionToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IDishOptionPtops> = ({
  isSelected,
  name,
  extra,
  dishId,
  addOptionToItem,
  removeOptionFromItem,
}) => {
  const onClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name);
    }
  };

  return (
    <span
      onClick={onClick}
      className={`flex border-4 items-center ${
        isSelected ? 'border-gray-800' : ''
      }`}
    >
      <h6 className="mr-2">{name}</h6>
      {extra && <h6 className="text-sm opacity-75">{extra}</h6>}
    </span>
  );
};
