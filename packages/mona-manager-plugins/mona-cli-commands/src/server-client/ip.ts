import opFetch from './idl/request';
import { deleteUser, readUser } from '@bytedance/mona-shared';
import chalk from 'chalk';

async function reportIp(appId: string = '7264459925647001145') {
  const user = readUser();
  // return opFetch(
  //   'https://opencloud.jinritemai.com/api/cloudoperation/local/debug/ip/upload?bizAppId=7264459925647001145',
  //   {
  //     headers: {
  //       cookie:
  //         'passport_csrf_token=5d017f0d0651a49760758a06d4308432; passport_csrf_token_default=5d017f0d0651a49760758a06d4308432; ttwid=1%7CUefyft8cEiY8PWa0NhmimDFBLFlPjSaxYO6EBNY_uVs%7C1690527582%7C36858d633aa38eadc820728411966e21db4f1033b874301283da8c89a49cb22a; odin_tt=bb6d3a3c20f506c7194e3556d1dd0b068432eb9a233a38c9c9b5ceaf82e613093b62c71ece9ce91a85fb87c3223a21b9cd9b2fceb3b45d588fe26263615f692e; n_mh=G9S0Ny4npPFDUe2U4sPqon5XPmug9VO8DW3WJZcmPkk; sso_uid_tt=705ed19dd800f2064b630d1e65b141ac; sso_uid_tt_ss=705ed19dd800f2064b630d1e65b141ac; toutiao_sso_user=1a8c3390de0420e3ab80ed66091be932; toutiao_sso_user_ss=1a8c3390de0420e3ab80ed66091be932; sid_ucp_sso_v1=1.0.0-KDgzNzVjYjI0NzUxODQ4ZWVhZmFiNjk0ZjQ5OTk0NzAxMDI3MWViMzIKHwjHqPDYzPX9AxC2kK-lBhiwISAMMNLlsvYFOAZA9AcaAmhsIiAxYThjMzM5MGRlMDQyMGUzYWI4MGVkNjYwOTFiZTkzMg; ssid_ucp_sso_v1=1.0.0-KDgzNzVjYjI0NzUxODQ4ZWVhZmFiNjk0ZjQ5OTk0NzAxMDI3MWViMzIKHwjHqPDYzPX9AxC2kK-lBhiwISAMMNLlsvYFOAZA9AcaAmhsIiAxYThjMzM5MGRlMDQyMGUzYWI4MGVkNjYwOTFiZTkzMg; passport_auth_status=a76f1d42771b61015f60b7c65584bc86%2C; passport_auth_status_ss=a76f1d42771b61015f60b7c65584bc86%2C; sid_guard=45c86c52b33c19d3a342c39c0d795cdf%7C1688979515%7C5184000%7CFri%2C+08-Sep-2023+08%3A58%3A35+GMT; uid_tt=49e27f7811d9758dde59c551ec5a8461; uid_tt_ss=49e27f7811d9758dde59c551ec5a8461; sid_tt=45c86c52b33c19d3a342c39c0d795cdf; sessionid=45c86c52b33c19d3a342c39c0d795cdf; sessionid_ss=45c86c52b33c19d3a342c39c0d795cdf; sid_ucp_v1=1.0.0-KDlmODE5MGQxMmVkMmUxMTMzNDY1Nzg1M2FhNjY3NzA2N2U2NThjNmUKGQjHqPDYzPX9AxC7kK-lBhiwISAMOAZA9AcaAmxxIiA0NWM4NmM1MmIzM2MxOWQzYTM0MmMzOWMwZDc5NWNkZg; ssid_ucp_v1=1.0.0-KDlmODE5MGQxMmVkMmUxMTMzNDY1Nzg1M2FhNjY3NzA2N2U2NThjNmUKGQjHqPDYzPX9AxC7kK-lBhiwISAMOAZA9AcaAmxxIiA0NWM4NmM1MmIzM2MxOWQzYTM0MmMzOWMwZDc5NWNkZg; ucas_sso_c0=CkEKBTEuMC4wELeIkazQhfLVZBjmJiCE7tDo2oycBiiwITDHqPDYzPX9A0C6kK-lBki6xOunBlCkvIfi9eqLsmBYbhIU8SgDU--C2IrZB0XfdoEo5B6QTQo; ucas_sso_c0_ss=CkEKBTEuMC4wELeIkazQhfLVZBjmJiCE7tDo2oycBiiwITDHqPDYzPX9A0C6kK-lBki6xOunBlCkvIfi9eqLsmBYbhIU8SgDU--C2IrZB0XfdoEo5B6QTQo; ucas_c0=CkEKBTEuMC4wEKKIk46HhvLVZBjmJiCE7tDo2oycBiiwITDHqPDYzPX9A0C7kK-lBki7xOunBlCkvIfi9eqLsmBYbhIULwEnX9gctoGfTtUoEVbtbS9roz4; ucas_c0_ss=CkEKBTEuMC4wEKKIk46HhvLVZBjmJiCE7tDo2oycBiiwITDHqPDYzPX9A0C7kK-lBki7xOunBlCkvIfi9eqLsmBYbhIULwEnX9gctoGfTtUoEVbtbS9roz4; store-region=cn-bj; store-region-src=uid; x-jupiter-uuid=16905275785176464; ttcid=39065a5d7ae14cbc9f2aeda2ec8db80724; msToken=bonWB93PlOtyluIvY7tRAPnw-Am_gXUn1BVVBM2QhB7aI72Lwkg34eMgaIDYaT6t6KTW3xgZC8h8BuPHUtoeiAW2mEAIeZuBC_wCIfg_yzuLNhzt5ty_; sid_guard_op=3d30f3216f83d47bc75ec865ea0faa84%7C1690527599%7C5184000%7CTue%2C+26-Sep-2023+06%3A59%3A59+GMT; uid_tt_op=7c675e3ec11960a43f56b14f2ca7d47f; uid_tt_ss_op=7c675e3ec11960a43f56b14f2ca7d47f; sid_tt_op=3d30f3216f83d47bc75ec865ea0faa84; sessionid_op=3d30f3216f83d47bc75ec865ea0faa84; sessionid_ss_op=3d30f3216f83d47bc75ec865ea0faa84; sid_ucp_v1_op=1.0.0-KDlmZTg0NmE4Nzg1MzhjMDUyYWJkMDU5N2VjZGFlMmJiNGQ5YTI0ZWEKGQiYmPDWpIycBxDvzo2mBhiwISAMOAFA6wcaAmxxIiAzZDMwZjMyMTZmODNkNDdiYzc1ZWM4NjVlYTBmYWE4NA; ssid_ucp_v1_op=1.0.0-KDlmZTg0NmE4Nzg1MzhjMDUyYWJkMDU5N2VjZGFlMmJiNGQ5YTI0ZWEKGQiYmPDWpIycBxDvzo2mBhiwISAMOAFA6wcaAmxxIiAzZDMwZjMyMTZmODNkNDdiYzc1ZWM4NjVlYTBmYWE4NA; ucas_c0_op=CkEKBTEuMC4wEKiIk4rn7NnhZBjBPiD43qC-n4w-KL8-MJiY8NakjJwHQO_OjaYGSO-CyqgGUIe8jeDM3M6PYViHARIUinQF0BruRrUrVLWgMjeqDwgXb0E; ucas_c0_ss_op=CkEKBTEuMC4wEKiIk4rn7NnhZBjBPiD43qC-n4w-KL8-MJiY8NakjJwHQO_OjaYGSO-CyqgGUIe8jeDM3M6PYViHARIUinQF0BruRrUrVLWgMjeqDwgXb0E; s_v_web_id=verify_lkm8i99t_mCzytfuY_JYKY_4hJD_9SpI_NmMxoK1NytdL; need_choose_shop=0; csrf_session_id=a68d55a5d17b61348dfe29bfe492f8d2; op_session=761cbe0ae35c6d112ab2e9861cb85f48:05afbb19ba817745d65a6091ed3bf4a0e87230ecc60d89e230fe0d365f284569; partner_workbench_session=673125bb75d8c38137ce6b89df924efe61e5ff49e627f80a953d5fdc5502f3dab433db37a2c7d48c80020792927fa0c593b8097f7d09ba4e9ac1f107902b72873686c3806f9d2d44a17f1520dcaf6ded; tt_scid=DnBHkyE-4u7DF5DAOkScqAEur1reeV76qSOy4YoRA9kkf-i07b-JnDoE9CogKTJdfd66; msToken=gUHJ0KZX1AZtX4qPQgpVHmcZa2jHavDwpmv1qpNSb2douYesgLbMXp9PnGPY32pwLBJs9FZrPJIEBQ04aeySibEj6aeY6VNjiWoZkugJgF139uqQR4C50A==',
  //     },
  //     // body: JSON.stringify({
  //     //   bizAppId: '7264459925647001145',
  //     // }),
  //   },
  // );
  if (!user) {
    console.log(chalk.red(`未登录，请使用 mona login 进行登录`));
    return;
  }
  if (user?.cookie) {
    return opFetch(`https://opencloud.jinritemai.com/api/cloudoperation/local/debug/ip/upload`, {
      headers: {
        cookie: user?.cookie,
      },
      method: 'POST',
      body: JSON.stringify({
        bizAppId: appId,
      }),
    });
  }
}

export async function ipInterval(inputAppId: string) {
  //  1. 获取本地后端地址

  try {
    await reportIp(inputAppId);
    setInterval(() => {
      reportIp();
    }, 30000);
  } catch (error: any) {
    deleteUser();
    console.log(`未登录，请使用 mona login 进行登录`);
    // process.exit(0);
    // spinner.fail('网关启动失败 ' + error?.message);
  }
}
