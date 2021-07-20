import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import {
  LoginMutation,
  LoginMutationVariables,
} from '../__generated__/loginMutation';

const LOGIN_MUTATION = gql`
  # $는 변수의 뜻 아래는 프론트엔드에서 정말 중요한 부분
  # 변수선언 및 타입을 알려주기 때문이고 백엔드의 schema와 동일하게 작성되어야함.
  mutation LoginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      ok
      token
      error
    }
  }
`;
interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginForm>();
  const [loginMutation, { loading, error, data }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION);

  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        email,
        password,
      },
    });

    console.log(getValues());
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-5 pb-8 rounded-lg text-center">
        <h3 className="font-bold text-2xl text-gray-800">Log In</h3>
        <form
          className=" grid gap-3 mt-5 px-5"
          action=""
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register('email', { required: 'Email is required' })}
            name="email"
            type="text"
            required
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: 10,
            })}
            name="password"
            type="password"
            required
            placeholder="Password"
            className=" bg-gray-100 shadow-inner focus:outline-none  focus:ring-2 focus:ring-green-600 focus:ring-opacity-90 py-3 px-5 rounded-lg"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === 'minLength' && (
            <span className="font-medium text-red-500">
              <FormError errorMessage="Password must be more than 10 chars." />
            </span>
          )}
          <button className="btn  mt-3">Log In</button>
        </form>
      </div>
    </div>
  );
};
