import { NavLink, useLocation, useSidebarData } from 'dumi';
import React, { type FC } from 'react';
import './index.less';

const Sidebar: FC = () => {
  const { pathname } = useLocation();
  const sidebar = useSidebarData();

  if (!sidebar) return null;

  console.log(pathname);
  return (
    <>
      {pathname !== '/' && pathname !== '/zh-CN' && (
        <div className="dumi-default-sidebar">
          {sidebar.map((item, i) => (
            <dl className="dumi-default-sidebar-group" key={String(i)}>
              {item.title && <dt>{item.title}</dt>}
              {item.children.map((child) => (
                <dd key={child.link}>
                  <NavLink to={child.link} title={child.title} end>
                    {child.title}
                  </NavLink>
                </dd>
              ))}
            </dl>
          ))}
        </div>
      )}
    </>
  );
};

export default Sidebar;
