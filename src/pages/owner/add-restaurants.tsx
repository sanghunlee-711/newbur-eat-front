import { useApolloClient, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
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
      restaurantId
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
  const client = useApolloClient();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState<string>('');
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, error, restaurantId },
    } = data;

    if (ok) {
      const { name, categoryName, address } = getValues();
      setUploading(false);

      //업데이트 후 곧바로 api 호출을 하는 낭비를 막기 위해 곧바로 fake restaurants를 만들어 렌더 시켜줄거임(캐시에 저장과 함께)
      //1. apollo client를 통해 브라우저의 Cache에 있는 데이터를 받아온다
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      console.log(queryResult);
      //2. writeQuery 를 이용해 데이터를 완전 바꿔치기 하는 것이 아니라 필요한 하나만 추가해주는 방식으로 기존형태를 유지하며 캐시에 작성해준다.
      if (
        queryResult &&
        queryResult.myRestaurants &&
        queryResult.myRestaurants.restaurants
      ) {
        client.writeQuery({
          query: MY_RESTAURANTS_QUERY,
          data: {
            myRestaurants: {
              ...queryResult.myRestaurants,
              restaurants: [
                {
                  address,
                  category: {
                    name: categoryName,
                    __typename: 'Category',
                  },
                  coverImg: imageUrl,
                  id: restaurantId,
                  isPromoted: false,
                  name,
                  __typename: 'Restaurant',
                },
                ...queryResult.myRestaurants.restaurants,
              ],
            },
          },
        });
        history.push('/');
      }
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

      setImageUrl(coverImg);
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
