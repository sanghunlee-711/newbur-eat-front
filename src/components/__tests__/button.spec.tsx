import { render } from '@testing-library/react';
import React from 'react';
import { Button } from '../button';

describe('<Button />', () => {
  // 프론트 테스트는 유저의 관점에서 컴포넌트가 어떻게 결과를 내느냐가 중요하므로
  // 백엔드의 테스트 코드처럼 한줄한줄의 로직을 모두 모킹하여 따지는 것이 아니라 output위주로 테스트를 진행하게 된다
  // implementation 위주로 테스트하는게 아니라는것으로 이해하면 간편
  it('should render OK with Props', () => {
    const { debug, getByText, rerender } = render(
      <Button canClick={true} loading={false} actionText="test" />
    );

    getByText('test');
    // rerender(<Button canClick={true} loading={true} actionText="test" />); // 리렌더 아래의 테스트 코드로 분리
    // getByText('Loading...');
  });

  it('should display Loading...', () => {
    const { debug, getByText, container } = render(
      <Button canClick={false} loading={true} actionText="test" />
    );
    getByText('Loading...');

    expect(container.firstChild).toHaveClass('pointer-events-none');
  });
});
