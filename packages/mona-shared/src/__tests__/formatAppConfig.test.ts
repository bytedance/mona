import formatAppConfig, { AppConfig } from '../formatAppConfig';

describe('shared formatAppConfig', () => {
  it('should format a appConfig correctly', () => {
    const appConfig: AppConfig = {
      pages: ['pages/Home/index', '/pages/List/index'],
      entryPagePath: '/pages/Home/index',
      window: {
        navigationBarBackgroundColor: 'red',
        navigationBarTitleText: 'home page'
      },
      tabBar: {
        color: 'red',
        selectedColor: 'blud',
        backgroundColor: 'white',
        borderStyle: 'black',
        list: [{
          pagePath: '/pages/Home/index',
          text: 'home',
          iconPath: '/images/home.png',
          selectedIconPath: '/images/home.png'
        }, {
          pagePath: 'pages/List/index',
          text: 'list',
          iconPath: '/images/list.png',
        }]
      }
    }

    expect(formatAppConfig(appConfig)).toEqual({
      ...appConfig,
      pages: ['pages/home/index', 'pages/list/index'],
      entryPagePath: 'pages/home/index',
      tabBar: {
        ...appConfig.tabBar,
        list: [{
          pagePath: 'pages/home/index',
          text: 'home',
          iconPath: '/images/home.png',
          selectedIconPath: '/images/home.png'
        }, {
          pagePath: 'pages/list/index',
          text: 'list',
          iconPath: '/images/list.png',
          selectedIconPath: '/images/list.png'
        }]
      }
    })
  })
})