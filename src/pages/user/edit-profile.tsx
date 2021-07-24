import { useApolloClient, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { useMe } from '../../hooks/useMe';
import {
  editProfile,
  editProfileVariables,
} from '../../__generated__/editProfile';

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;

    if (ok && userData) {
      //mutation 쿼리를 날리고 cache를 프론트단에서 직접(곧바로) 업데이트 해주면 속도가 훨씬 빨라짐
      //쿼리가 cache의 변경을 보고 업데이트를 위해 다시 서버를 fetch하지 않아도 되기 때문이다<div className=""></div>
      //update cache
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              email
              verified
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };

  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode: 'onChange',
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== '' && { password }),
        },
      },
    });
    console.log(getValues());
  };

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 mb-5 w-full"
      >
        <input
          {...register('email', {
            // required: 'Email is required',
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g,
          })}
          name="email"
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          {...register('password')}
          name="password"
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Save Profile"
        />
      </form>
    </div>
  );
};
