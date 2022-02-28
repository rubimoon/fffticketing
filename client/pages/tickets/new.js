import { useState } from 'react';
import { TICKETS_API } from '../../api/services';
import { useRequest } from '../../hooks/use-request';
import Router from 'next/router';
import { ALL_TICKETS } from '../../api/pages';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { processRequest, errors } = useRequest({
    url: TICKETS_API,
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push(ALL_TICKETS),
  });

  const blurHandler = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };
  const submitHandler = (event) => {
    event.preventDefault();
    processRequest();
  };
  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label htmlFor=''>Title</label>
          <input
            value={title}
            className='form-control'
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor=''>Price</label>
          <input
            value={price}
            onBlur={blurHandler}
            className='form-control'
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {errors}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
