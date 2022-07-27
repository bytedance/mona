import { promisify } from '../promisify';
type Options = {
  success?: (param: any) => void;
  fail?: (param: any) => void;
  [key: string]: any;
};
function ReturnObject(taskName) {
  this.taskName = taskName;
  this.taskFunc = () => this.taskName;
}
const asyncFuncSuccessed = function (options: Options) {
  setTimeout(() => {
    options.success?.('result is returned correctly');
  }, 100);
  return new ReturnObject('aysncExampleTask');
};
const asyncFuncFailed = function (options: Options) {
  setTimeout(() => {
    options.fail?.('result is not returned');
  }, 100);
};
const successCallbackGenerator = done => {
  return res => {
    try {
      expect(res).toBe('result is returned correctly');
      done();
    } catch (error) {
      done(error);
    }
  };
};

const failCallbackGenerator = done => {
  return err => {
    try {
      expect(err).toBe('result is not returned');
      done();
    } catch (error) {
      done(error);
    }
  };
};

describe('shared promisify', () => {
  //   测试只使用callback的成功异步函数，只调用success函数
  test('success Async Func with callback', done => {
    const successCallback = successCallbackGenerator(done);
    promisify(asyncFuncSuccessed)({ success: successCallback });
  });
  //   测试只使用callback的失败异步函数;会调用fail方法，但由于fail中会调用reject，因此会继续抛出rejectunhandle错误
  test('fail Async Func with callback', done => {
    expect.assertions(2);

    const failCallback = failCallbackGenerator(done);
    promisify(asyncFuncFailed)({ fail: failCallback }).catch(e => expect(e).toMatch('result is not returned'));
  });
  //  测试只使用fullfilledthen的成功异步函数，
  test('success Async Func with fullfilledThen', () => {
    return promisify(asyncFuncSuccessed)({}).then(res => {
      expect(res).toBe('result is returned correctly');
    });
  });

  //测试只使用catch的失败异步函数
  test('fail Async Func with catch', () => {
    return promisify(asyncFuncSuccessed)({}).catch(err => {
      expect(err).toBe('result is not returned');
    });
  });
  //测试同时使用success callback以及fufilled then的成功异步函数，同时调用callback和then
  test('success Async Func with callback and fullfilled then', done => {
    const successCallback = successCallbackGenerator(done);
    promisify(asyncFuncSuccessed)({ success: successCallback }).then(res => {
      expect(res).toBe('result is returned correctly');
    });
  });
  //测试同时使用fail callback以及catch的失败异步函数，同时调用callback和catch
  test('fail Async Func with callback and catch', done => {
    expect.assertions(2);
    const failCallback = failCallbackGenerator(done);
    promisify(asyncFuncFailed)({ fail: failCallback }).catch(err => expect(err).toBe('result is not returned'));
  });
  //测试成功调用时返回的方法绑定在promise对象上并能正常调用,并且有正确的this指向
  test('success returned Promise Object with origin return Oeject funcs', done => {
    const successCallback = successCallbackGenerator(done);
    expect(promisify(asyncFuncSuccessed)({ success: successCallback }).taskFunc()).toBe('aysncExampleTask');
  });
});
