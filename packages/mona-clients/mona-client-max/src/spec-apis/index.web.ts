// import { request, setStorage, getStorage } from '@bytedance/mona-client-web/dist/apis/api';
import axios from 'axios';
// import { genMaxEventSdk } from "./sdk";

// Compatible with web
// export const max = genMaxEventSdk({ appid: __MONA_APPID, request, setStorage, getStorage });

const secShopId = window.sec_shop_id;

const genErrorRes = () => Promise.reject(new Error('当前环境未检测到有效的shopId，请在新版编辑器查看'));

const nativeFetch: (params: any) => Promise<{ code: number; raw: any }> = params => {
  let resultUrl = params.url;
  const method = params.method || 'GET';
  const headers = params.headers || {};

  return new Promise(resolve =>
    axios({
      url: resultUrl,
      data: params.data,
      method,
      params: { ...params.params },
      headers: {
        ...headers,
        'x-preview': 1, // 非app环境带上这个头是为了提供没有用户信息情况下的数据
      },
    }).then(res => {
      resolve({
        code: 1,
        raw: { data: res?.data?.data },
      });
    }),
  );
};

export const max = {
  transformImgToWebp({ url } : { url: string }) {
    if (typeof url !== 'string') return url;

    try {
      // 只有.image结尾的图片才可以支持webp
      const isDotImageEndReg = /\.image$/;

      if (isDotImageEndReg.test(url)) {
        return url.replace(isDotImageEndReg, '.webp');
      } else {
        return { url }
      }
    } catch (e) {
      console.error('图片转webp错误', e);
      return { url: url };
    }
  },
  fetchSellPoints({ product_ids }: { product_ids: string[] }) {
    if (!secShopId) {
      return genErrorRes()
    }
    if (!Array.isArray(product_ids)) {
      return Promise.reject(new Error('商品id必传'))
    }

    return nativeFetch({
      url: 'https://lianmengapi.snssdk.com/shop/isv/product/sellpoints/mget',
      method: 'get',
      params: {
        product_ids: product_ids.join(),
        sec_shop_id: secShopId
      }
    });
  },
  fetchInteracts() {
    return Promise.reject(new Error('当前环境未实现max.fetchInteracts'));
  },
  fetchMiniApps() {
    return Promise.reject(new Error('当前环境未实现max.fetchMiniApps'));
  },
  fetchVideoInfos({ vids }: { vids: string[] }) {
    if (!secShopId) {
      return genErrorRes()
    }
    if (!Array.isArray(vids)) {
      return Promise.reject(new Error('视频id必传'))
    }

    return nativeFetch({
      url: 'https://lianmengapi.snssdk.com/shop/isv/playinfo/mget',
      method: 'get',
      params: {
        vids: vids.join(),
        sec_shop_id: secShopId
      }
    });
  },
  fetchProducts({ product_ids } : { product_ids: string[] }) {
    if (!secShopId) {
      return genErrorRes()
    }
    if (!Array.isArray(product_ids)) {
      return Promise.reject(new Error('商品id必传'))
    }
    return nativeFetch({
      url: 'https://lianmengapi.snssdk.com/shop/isv/product/sellpoints/mget',
      method: 'get',
      params: {
        product_ids: product_ids.join(),
        sec_shop_id: secShopId
      }
    })
  },
  fetchCoupons({ coupon_meta_ids, m_config_type }: { coupon_meta_ids: string[], m_config_type: number }) {
    if (!secShopId) {
      return genErrorRes()
    }

    if (!Array.isArray(coupon_meta_ids) || typeof m_config_type !== 'number') {
      return Promise.reject(new Error('参数错误'))
    }

    return nativeFetch({
      url: "https://lianmengapi.snssdk.com/shop/isv/coupon/mget",
      method: "get",
      params: {
        coupon_meta_ids: coupon_meta_ids.join(),
        m_config_type: m_config_type,
        sec_shop_id: secShopId
      },
    });
  },
  fetchActivities({ activity_ids, activity_type, m_config_type }: { activity_ids: string[], activity_type: number, m_config_type: number }) {
    if (
      !Array.isArray(activity_ids) ||
      typeof m_config_type !== 'number' ||
      typeof activity_type !== 'number'
    ) {
      return Promise.reject(new Error('参数错误'))
    }

    return nativeFetch({
      url: "https://lianmengapi.snssdk.com/shop/isv/activity/mget",
      method: "get",
      headers: {},
      params: {
        activity_ids: activity_ids.join(),
        activity_type: activity_type,
        m_config_type: m_config_type,
        sec_shop_id: secShopId
      },
    });
  }
}
