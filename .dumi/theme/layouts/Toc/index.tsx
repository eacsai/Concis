import { Scrollspy as ScrollSpy } from '@makotot/ghostui/src/Scrollspy';
import animateScrollTo from 'animated-scroll-to';
import { useLocation, useRouteMeta, useSiteData } from 'dumi';
import React, { useCallback, useEffect, useRef, useState, type FC, type RefObject } from 'react';
import './index.less';

// 滚动过渡到指定位置
const scrollTo = (newTop: number) => {
  animateScrollTo(newTop, {
    speed: 200,
  });
};

// 替换锚点
const setAnchorPoint = (hashConfig: string, hashId: string) => {
  if (hashConfig) {
    // 有锚点，替换锚点值
    const oldHashPath = window.location.hash.split('#');
    const length = oldHashPath.length;
    oldHashPath[length - 1] = hashId;
    window.location.hash = oldHashPath.join('#');
  } else {
    //无锚点，直接拼接到最后
    window.location.hash += `#${hashId}`;
  }
};

const Toc: FC = () => {
  const { pathname, hash } = useLocation();

  const meta = useRouteMeta();
  const { loading } = useSiteData();
  const prevIndexRef = useRef(0);
  const [sectionRefs, setSectionRefs] = useState<RefObject<HTMLElement>[]>([]);
  // only render h2 ~ h4
  const toc = meta.toc.filter(({ depth }) => depth > 1 && depth < 4);

  useEffect(() => {
    // wait for page component ready (DOM ready)
    if (!loading) {
      // find all valid headings as ref elements
      const refs = toc.map(({ id }) => ({
        current: document.getElementById(id),
      }));

      setSectionRefs(refs as any);
    }
  }, [pathname, loading]);

  // 点击toc item，页面滚动平滑到对应为止
  const scrollToByIndex = useCallback(
    (h2Index: number, hashId: string) => {
      const clickNode = sectionRefs[h2Index].current;
      setAnchorPoint(hash, hashId);

      if (clickNode) {
        // 点击目标位置
        const newTop = clickNode.offsetTop;
        scrollTo(newTop);
      }
    },
    [sectionRefs, hash]
  );

  return sectionRefs.length ? (
    <ScrollSpy sectionRefs={sectionRefs}>
      {({ currentElementIndexInViewport }) => {
        // for keep prev item active when no item in viewport
        if (currentElementIndexInViewport > -1)
          prevIndexRef.current = currentElementIndexInViewport;

        return (
          <ul className="dumi-default-toc">
            {toc
              .filter(({ depth }) => depth > 1 && depth < 4)
              .map((item, i) => {
                const link = `${encodeURIComponent(item.id)}`;
                const activeIndex =
                  currentElementIndexInViewport > -1
                    ? currentElementIndexInViewport
                    : prevIndexRef.current;

                return (
                  <li key={item.id} data-depth={item.depth}>
                    <a
                      // href={link}
                      onClick={() => scrollToByIndex(i, link)}
                      title={item.title}
                      {...(activeIndex === i ? { className: 'active' } : {})}
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
          </ul>
        );
      }}
    </ScrollSpy>
  ) : null;
};

export default Toc;
