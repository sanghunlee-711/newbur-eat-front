import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import {
  createRestaurant,
  createRestaurantVariables,
} from '../../__generated__/createRestaurant';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';

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
  file: FileList;
}

export const AddRestaurants = () => {
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, error },
    } = data;

    if (ok) {
      setUploading(false);
    }
  };

  const [createRestaurantMutation, { loading, error, data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTAION, {
    onCompleted,
    refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
  });

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormProps>({
    mode: 'onChange',
  });

  const [uploading, setUploading] = useState(false);

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append('file', actualFile);
      const { url: coverImg } = await (
        await fetch('http://localhost:4000/uploads/', {
          method: 'POST',
          body: formBody,
        })
      ).json();

      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }

    // console.log(getValues());
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
        <div>
          <input
            type="file"
            accept="image/*"
            {...register('file', { required: true })}
          />
        </div>
        <Button
          loading={uploading}
          canClick={isValid}
          actionText="Create Restaurants"
        />
        {data?.createRestaurant.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
