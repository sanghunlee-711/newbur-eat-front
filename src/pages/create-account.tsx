import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import newberLogo from '../images/eats-logo-1a01872c77.svg';
import {
  createAccountMutation,
  createAccountMutationVariables,
} from '../__generated__/createAccountMutation';
import { UserRole } from '../__generated__/globalTypes';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;
interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

const CreateAccount = () => {
  const {
    register,
    getValues,
    watch,

    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ICreateAccountForm>({
    mode: 'onChange',
    defaultValues: {
      role: UserRole.Client,
    },
  });

  const onSubmit = () => {
    const { email, password, role } = getValues();

    if (!loading) {
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };

  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      alert('Account Created! Log in now!');
      history.push('/');
      //redirect
    }
  };

  const [
    createAccountMutation,
    { data: createAccountMutationResult, loading },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted: onCompleted,
    }
  );

  return (
    <div className="h-screen flex  items-center flex-col mt-10 lg:mt-28 ">
      <Helmet>
        <title>Create Account | Newber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={newberLogo} alt="logo" className=" w-52 mb-10" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Let's get started
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
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g,
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
          <select {...register('role', { required: true })} className="input">
            {Object.keys(UserRole).map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === 'minLength' && (
            <span className="font-medium text-red-500">
              <FormError errorMessage="Password must be more than 10 chars." />
            </span>
          )}
          <Button
            canClick={isValid}
            loading={loading}
            actionText="Create account"
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          Already have an account?{' '}
          <Link to="/" className="text-lime-600 hover:underline">
            Login now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
