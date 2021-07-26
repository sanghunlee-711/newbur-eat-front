import React from 'react';

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  coverImg,
  name,
  categoryName,
}) => {
  return (
    <div className="flex flex-col">
      <div
        style={{ backgroundImage: `url(${coverImg})` }}
        className=" mb-3 py-28 bg-cover bg-center"
      ></div>
      <h3 className="text-xl ">{name}</h3>
      <span className=" border-t mt-2 py-2 text-xs border-gray-300 opacity-50">
        {categoryName}
      </span>
    </div>
  );
};
