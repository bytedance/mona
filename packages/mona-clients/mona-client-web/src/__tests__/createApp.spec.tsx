import { NoMatch, HistorySetWrapper, WrapperComponent } from '../createWebApp';

import React from 'react';
import { configure, mount } from 'enzyme';

import mountTest from '../../../../tests/shared/mountTest';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

describe('NoMatch', () => {
  mountTest(NoMatch);

  it('should render correctly', () => {
    expect(mount(<NoMatch defaultPath="/path/a/b" />).render()).toMatchSnapshot();
  });
});

describe('WrapperComponent', () => {
  mountTest(WrapperComponent);

  it('should render correctly', () => {
    expect(
      mount(
        <WrapperComponent title="/path/a/b">
          <div>test</div>
        </WrapperComponent>,
      ).render(),
    ).toMatchSnapshot();
  });
});

describe('HistorySetWrapper', () => {
  mountTest(HistorySetWrapper);

  it('should render correctly', () => {
    expect(
      mount(
        <HistorySetWrapper>
          <div>test</div>
        </HistorySetWrapper>,
      ).render(),
    ).toMatchSnapshot();
  });
});
