import React from 'react';
import { Portal } from 'react-is';
import { stringifySearch } from '@bytedance/mona-shared';
import createPage, { createPortal } from '../createPage';

jest.mock('react');
jest.mock('react-is');
jest.mock('@bytedance/mona-shared');
jest.mock('@bytedance/mona');
jest.mock('@/reconciler/TaskController');
jest.mock('@/reconciler');
jest.mock('./reconciler/ServerElement');
jest.mock('@bytedance/mona-shared');

describe('createPortal', () => {
  it('should expose a function', () => {
    // const retValue = createPortal(children,containerInfo,key);
    expect(false).toBeTruthy();
  });
});
describe('createPage', () => {
  it('should expose a function', () => {
    // const retValue = createPage(Component);
    expect(false).toBeTruthy();
  });
});
