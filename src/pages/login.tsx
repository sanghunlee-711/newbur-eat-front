import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authToken, isLoggedInVar } from '../apollo';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import { LOCALSTORAGE_TOKEN } from '../constant';
import newberLogo from '../images/eats-logo-1a01872c77.svg';
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
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ILoginForm>({
    mode: 'onBlur',
  });

  const onCompleted = (data: loginMutation) => {
    console.log(data);
    const {
      login: { error, ok, token },
    } = data;

    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authToken(token);
      isLoggedInVar(true); //reactiveVar에 저장
    } else {
      if (error) {
        console.error(error);
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
    <div className="h-screen flex  items-center flex-col mt-10 lg:mt-28 ">
      <Helmet>
        <title>Login | Newber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={newberLogo} alt="logo" className=" w-52 mb-10" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Wecolme back
        </h4>
        <form
          className=" grid gap-3 mt-5 w-full mb-3"
          action=""
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register('email', {
              required: 'Email is required',
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g,
            })}
            name="email"
            type="text"
            required
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === 'pattern' && (
            <FormError errorMessage="Please Enter a valid email" />
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
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === 'minLength' && (
            <span className="font-medium text-red-500">
              <FormError errorMessage="Password must be more than 10 chars." />
            </span>
          )}
          <Button canClick={isValid} loading={loading} actionText="Log In" />

          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to Newber?{' '}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
