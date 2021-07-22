import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { isLoggedInVar } from '../apollo';
import { meQuery } from '../__generated__/meQuery';

const ME_QUERY = gql`
  #  여기가 ts용 이름
  query meQuery {
    #  여기가 백엔드에 날릴 실제 쿼리 이름
    me {
      id
      email
      role
      verified
    }
  }
`;

export default function LoggedInRouter() {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY);
  console.log(error);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading ...</span>
      </div>
    );
  }
  const onClick = () => {
    isLoggedInVar(false);
  };

  return (
    <div>
      <h1>{data.me.role}</h1>
    </div>
  );
}
