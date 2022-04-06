import { NetWork } from '../../../index';

function escapeStringRegexp(str: string) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }

  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}
const NetworkError = {
  NO_ACCESS_HTTP_DOMAIN: '不允许访问http://开头的域名',
  NO_ALLOW_DOMAIN: '不允许访问非白名单外的域名',
  NO_BLOCK_DOMAIN: '不允许访问黑名单域名',
};

export function NetWorkBlock(netWorkConfig: NetWork, url: string) {
  const { allowDomains, canAccessHttp, blockDomains = [], canAccessOriginDomain } = netWorkConfig;
  const ret = {
    message: '',
  };
  // 是否不允许访问主应用域名，扔到黑名单里面去
  if (!canAccessOriginDomain) blockDomains.push(location.origin);

  // 如果不允许访问http域名且当前域名是http开头
  if (!canAccessHttp && url.startsWith('http://')) {
    ret.message = NetworkError.NO_ACCESS_HTTP_DOMAIN;
    return ret;
  }

  if (Array.isArray(allowDomains)) {
    // 白名单是否允许当前域名
    const canAllowDomainAccess = allowDomains.find(domains => {
      const reg = escapeStringRegexp(domains).replace(/\*/g, 'S+');
      return new RegExp(reg).test(url);
    });

    // 如果白名单不允许访问 则返回
    if (!canAllowDomainAccess) ret.message = NetworkError.NO_ALLOW_DOMAIN;

    return ret;
  }

  // 如果不存在黑名单 判断黑名单是否拦截该域名
  if (blockDomains?.length) {
    const hasBlockDomain = blockDomains.find(domains => {
      const reg = escapeStringRegexp(domains).replace(/\*/g, 'S+');
      return new RegExp(reg).test(url);
    });

    if (hasBlockDomain) {
      ret.message = NetworkError.NO_BLOCK_DOMAIN;
      return ret;
    }
  }
  return ret;
}
