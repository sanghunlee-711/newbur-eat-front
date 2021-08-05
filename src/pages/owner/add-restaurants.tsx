import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import {
  createRestaurant,
  createRestaurantVariables,
} from '../../__generated__/createRestaurant';

const CREATE_RESTAURANT_MUTAION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}

export const AddRestaurants = () => {
  const [createRestaurantMutation, { loading, error, data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTAION);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormProps>({
    mode: 'onChange',
  });

  const onSubmit = () => {
    console.log(getValues());
  };

  return (
    <div className="container mt-32 flex items-center flex-col">
      <Helmet>
        <title>Add Restaurants | Newber Eats</title>
      </Helmet>
      <h1 className=" font-semibold	 text-xl mb-8">AddRestaurants</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col  w-2/3">
        <input
          className="input mb-8"
          type="text"
          placeholder="Name"
          {...register('name', { required: 'Name is required' })}
        />
        <input
          className="input mb-8"
          type="text"
          placeholder="Address"
          {...register('address', { required: 'Address is required' })}
        />
        <input
          className="input mb-8"
          type="text"
          placeholder="Category Name"
          {...register('categoryName', { required: 'Categoryname isrequired' })}
        />
        <Button
          loading={loading}
          canClick={isValid}
          actionText="Create Restaurants"
        />
      </form>
    </div>
  );
};
