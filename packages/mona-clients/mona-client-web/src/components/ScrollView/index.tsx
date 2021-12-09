import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { ScrollViewProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';
import { formatSyntheticEvent } from '../utils';

//t = current time
//b = start value
//c = change in value
//d = duration
function easeInOutQuad(t: number, b: number, c: number, d: number) {
  t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};


function scrollToWithAnimation(element: HTMLDivElement, to: number, duration: number, vertical: boolean) {
    const start = vertical ? element.scrollTop : element.scrollLeft;
    const change = to - start;
    let currentTime = 0;
    const increment = 20;
        
    const animateScroll = function(){        
        currentTime += increment;
        const val = easeInOutQuad(currentTime, start, change, duration);
        if (vertical) {
          element.scrollTop = val;
        } else {
          element.scrollLeft = val;
        }
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

type onScrollCallback = (ele: Element) => void;

interface ScrollViewContextProps {
  registerScrollCallback: (callback: onScrollCallback) => void;
  unregisterScrollCallback: (callback: onScrollCallback) => void;
}

export const ScrollViewContext = React.createContext<ScrollViewContextProps | null>(null)

const ScrollView: React.FC<ScrollViewProps> = (props) => {
  const {
    children,
    scrollIntoView,
    upperThreshold,
    lowerThreshold,
    scrollWithAnimation,
    scrollTop,
    scrollLeft,
    scrollX,
    scrollY,
    onScroll,
    onScrollToUpper,
    onScrollToLower,
    ...restProps
  } = props;
  const { handleClassName, ...handleProps } = useHandlers(restProps)
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const topPreRef = useRef(0);
  const leftPreRef = useRef(0);

  const cbRefs = useRef<onScrollCallback[]>([]);
  const context = useMemo(() => ({
    registerScrollCallback: (callback: onScrollCallback) => {
      cbRefs.current.push(callback)
    },
    unregisterScrollCallback: (callback: onScrollCallback) => {
      const index = cbRefs.current.indexOf(callback);
      cbRefs.current.splice(index, 1)
    }
  }), [])

  const overflow = `${scrollX ? 'auto' : 'hidden'} ${scrollY ? 'auto' : 'hidden'}`;

  const handleScroll = (e: React.SyntheticEvent) => {
    if (typeof onScroll === 'function') {
      onScroll(formatSyntheticEvent({ event: e }))
    }

    
    if (scrollRef.current) {
      cbRefs.current.forEach(cb => cb(scrollRef.current!));

      const top = scrollRef.current.scrollTop;
      const left = scrollRef.current.scrollLeft;
      const currentUpperThreshold = upperThreshold || 0;
      const currentLowerThreshold = lowerThreshold || 0;

      if (typeof onScrollToUpper === 'function') {
        if (scrollY && ((currentUpperThreshold > topPreRef.current && currentUpperThreshold <= top) || (currentUpperThreshold < topPreRef.current && currentUpperThreshold >= top))) {
          onScrollToUpper(formatSyntheticEvent({ event: e, type: 'scrolltoupper' }))
        }
        if (scrollX && ((currentUpperThreshold > leftPreRef.current && currentUpperThreshold <= left) || (currentUpperThreshold < leftPreRef.current && currentUpperThreshold >= left))) {
          onScrollToUpper(formatSyntheticEvent({ event: e, type: 'scrolltoupper' }))
        }  
      }

      if (typeof onScrollToLower === 'function') {
        if (scrollY) {
          const clientHeight = scrollRef.current.clientHeight;
          const scrollHeight = scrollRef.current.scrollHeight;
          const currentLower = scrollHeight - clientHeight - top;
          const prevLower = scrollHeight - clientHeight - topPreRef.current;
          if ((currentLowerThreshold > prevLower && currentLowerThreshold <= currentLower) || (currentLowerThreshold < prevLower && currentLowerThreshold >= currentLower)) {
            onScrollToLower(formatSyntheticEvent({ event: e, type: 'scrolltolower' }))
          }
        }
        if (scrollX) {
          const clientWidth = scrollRef.current.clientWidth;
          const scrollWidth = scrollRef.current.scrollWidth;
          const currentLower = scrollWidth - clientWidth - left;
          const prevLower = scrollWidth - clientWidth - leftPreRef.current;
          if ((currentLowerThreshold > prevLower && currentLowerThreshold <= currentLower) || (currentLowerThreshold < prevLower && currentLowerThreshold >= currentLower)) {
            onScrollToLower(formatSyntheticEvent({ event: e, type: 'scrolltolower' }))
          }
        }
      }

      topPreRef.current = top;
      leftPreRef.current = left;
    }
  }

  useLayoutEffect(() => {
    if (scrollY && scrollRef.current && scrollTop != null) {
      if (scrollWithAnimation) {
        scrollToWithAnimation(scrollRef.current, scrollTop, 300, true);
      } else {
        scrollRef.current.scrollTop = scrollTop;
      }
    }
  }, [scrollTop, scrollY, scrollWithAnimation])

  useLayoutEffect(() => {
    if (scrollX && scrollRef.current && scrollLeft != null) {
       if (scrollWithAnimation) {
        scrollToWithAnimation(scrollRef.current, scrollLeft, 300, false);
      } else {
        scrollRef.current.scrollLeft = scrollLeft;
      }
    }
  }, [scrollLeft, scrollX, scrollWithAnimation])

  useLayoutEffect(() => {
    if (scrollRef.current && scrollIntoView) {
      const $target = scrollRef.current.querySelector(`#${scrollIntoView}`)
      if ($target) {
        $target.scrollIntoView({ behavior: scrollWithAnimation ? 'smooth' : 'auto', block: 'start', inline: 'start' })
      }
    }
  }, [scrollIntoView, scrollWithAnimation])


  return (
    <div {...handleProps} className={handleClassName(styles.container)}>
      <div ref={scrollRef} className={styles.container} onScroll={handleScroll} style={{ overflow }}>
        <ScrollViewContext.Provider value={context}>
          {children}
        </ScrollViewContext.Provider>
      </div>
    </div>
  )
}

export default ScrollView;
