import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated__/loginMutation';

//  $는 변수의 뜻 아래는 프론트엔드에서 정말 중요한 부분
// 변수선언 및 타입을 알려주기 때문이고 백엔드의 schema와 동일하게 작성되어야함.
const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
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

  const onCompleted = (data: loginMutation) => {
    console.log(data);
    const {
      login: { error, ok, token },
    } = data;

    if (ok) {
      console.log(token);
    } else {
      if (error) {
        console.log(error);
      }
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: { email, password },
        },
      });
    }
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
          <button className="btn  mt-3">
            {loading ? 'Loading...' : 'Log In'}
          </button>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};
