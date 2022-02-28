import { useEffect } from 'react';
import { useRequest } from '../../hooks/use-request';
import Router from 'next/router';
import { SIGNOUT_API } from '../../api/services';

const Signout = () => {
  const { processRequest } = useRequest({
    url: SIGNOUT_API,
    method: 'post',
    body: {},
    onSuccess() {
      Router.push('/');
    },
  });

  useEffect(() => {
    processRequest();
  }, []);

  return <div>You are signed out.</div>;
};

export default Signout;
