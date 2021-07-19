import { useForm } from 'react-hook-form';

interface IForm {
  email: string;
  password: string;
}

export const LoggedOutRouter = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>();

  const onSubmit = () => {
    console.log(watch());
  };
  const onInvalid = () => {
    console.log('cant create account');
    console.log(errors);
  };

  return (
    <div>
      <h1>Logged out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            {...register('email', {
              required: true,
              pattern: /^[A-Za-z0-9._$+=]+gmail.com$/,
            })}
            type="email"
            name="email"
            required
            placeholder="email"
          />
          {errors.email?.message && (
            <span className="bg-yellow-200">{errors.email.message}</span>
          )}

          {errors.email?.type === 'pattern' && (
            <span className="red">Only gmail allowed</span>
          )}
        </div>
        <div>
          <input
            {...register('password', {
              required: true,
            })}
            type="password"
            name="password"
            required
            placeholder="password"
          />
        </div>
        <button type="submit" className="bg-yellow-100 text-white">
          Submit
        </button>
      </form>
    </div>
  );
};
