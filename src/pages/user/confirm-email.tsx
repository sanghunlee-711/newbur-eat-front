import { useApolloClient, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useMe } from '../../hooks/useMe';
import {
  verifyEmail,
  verifyEmailVariables,
} from '../../__generated__/verifyEmail';

const VERIFY_EMAIL_MUTATION = gql`
  # for ts
  mutation verifyEmail($input: VerifyEmailInput!) {
    # for apollo
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = useMe();

  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok, error },
    } = data;

    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });

      history.push('/');
    }
  };

  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    { onCompleted }
  );
  useEffect(() => {
    const [_, code] = window.location.href.split('code='); //지렸다..

    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, []);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-1 font-medium"> Confirming email... </h2>
      <h4 className=" text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
