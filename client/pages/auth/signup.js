import Router from 'next/router';
import { useState } from 'react';
import { SIGNUP_API } from '../../api/services';
import { useRequest } from '../../hooks/use-request';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { processRequest, errors } = useRequest({
    url: SIGNUP_API,
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
      <h1>Sign Up</h1>
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
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
