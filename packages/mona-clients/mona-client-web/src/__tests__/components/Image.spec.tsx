import React from 'react';
import { mount } from 'enzyme';
import Image from '../../components/Image';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { ImageProps } from '@bytedance/mona';
import ScrollView from '../../components/ScrollView';

describe('web component: Image', () => {
  mountTest(Image)
  handlerTest({ Component: Image });

  it('should render correctly', () => {
    expect(mount(<Image src="" />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: ImageProps = {
      src: 'https://baidu.com',
      mode: 'bottom',
      lazyLoad: true,
      onError: () => {},
      onLoad: () => {},
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Image {...props} />);
    expect(wrapper.render()).toMatchSnapshot();
  })

  // TODO: finish this
  it('should lazy load image when set lazyLoad: true', () => {
    const wrapper = mount(
      <ScrollView>
        <Image src='https://lf3-cm.ecombdstatic.com/obj/ecom-open-butler/prod/temp/90fab59c62dc11ecb1237cd30a502d1a.png' lazyLoad={true} />
      </ScrollView>
    );
    
    let counter = 0;
    jest.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(() => 100);
    jest.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(() => 100);
    // @ts-ignore
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => {
      counter++;
      if (counter === 1) {
        return { top: 100, left: 0 }
      } else if (counter === 3) {
        return { top: 200, left: 0 }
      } else {
        return { top: 300, left: 0 }
      }
    })
    wrapper.find('div').at(1).simulate('scroll');
    expect(wrapper.find('img')).toHaveLength(0);
    wrapper.find('div').at(1).simulate('scroll');
    expect(wrapper.find('img')).toHaveLength(1);
  })

  // it('should trigger onError when image load failed', () => {
  //   const onLoad = jest.fn();
  //   const onError = jest.fn();

  //   const wrapper = mount(<Image onLoad={onLoad} src="aaa" />)
  //   expect(wrapper.find('img')).toHaveLength(1);
  //   wrapper.update();
  //   expect(onLoad).not.toHaveBeenCalled();
  //   expect(onError).toHaveBeenCalled();
  // })
})
