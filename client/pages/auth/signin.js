import Router from 'next/router';
import { useState } from 'react';
import { SIGNIN_API } from '../../api/services';
import { useRequest } from '../../hooks/use-request';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { processRequest, errors } = useRequest({
    url: SIGNIN_API,
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess() {
      Router.push('/');
    },
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    await processRequest();
  };

  return (
    <form>
      <h1>Sign In</h1>
      <div className='form-group'>
        <label>Email Address</label>
        <input
          value={email}
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          className='form-control'
        />
      </div>
      <div className='form-group'>
        <label>Passowrd</label>
        <input
          value={password}
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          className='form-control'
        />
      </div>
      {errors}
      <button onClick={submitHandler} className='btn btn-primary'>
        Sign In
      </button>
    </form>
  );
};

export default Signin;
