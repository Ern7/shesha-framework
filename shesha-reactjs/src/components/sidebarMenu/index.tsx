import React, { FC, useState } from 'react';
import { Menu } from 'antd';
import { MenuTheme } from 'antd/lib/menu/MenuContext';
import { useLocalStorage } from '../../hooks';
import { ISidebarMenuItem, useSidebarMenu } from '../../providers/sidebarMenu';
import { getCurrentUrl, normalizeUrl } from '../../utils/url';
import { renderSidebarMenuItem } from './utils';
import { useShaRouting } from '../../providers';

export interface ISidebarMenuProps {
  isCollapsed?: boolean;
  theme?: MenuTheme;
}

const findItem = (target: string, array: ISidebarMenuItem[]): ISidebarMenuItem => {
  for (const item of array) {
    if (item.target === target) return item;
    if (item.childItems) {
      const child = findItem(target, item.childItems);
      if (child) return child;
    }
  }
  return null;
};

export const SidebarMenu: FC<ISidebarMenuProps> = ({ theme = 'dark' }) => {
  const [openedKeys, setOpenedKeys] = useLocalStorage('openedSidebarKeys', null);
  const { getItems, isItemVisible } = useSidebarMenu();
  const { router } = useShaRouting();

  const currentPath = normalizeUrl(getCurrentUrl());
  const items = getItems();
  const [selected, setSelected] = useState(findItem(currentPath, items));

  if ((items ?? []).length === 0) return null;

  const onOpenChange = (openKeys: React.Key[]) => {
    setOpenedKeys(openKeys);
  };

  const keys = openedKeys && openedKeys.length > 0 ? openedKeys : undefined;

  const handleNavigate = (url: string) => {
    if (!url) return;
    if (typeof router === 'object') {
      try {
        setSelected(findItem(url, items));
        router?.push(url);
      } catch (error) {
        window.location.href = url;
      }
    } else {
      window.location.href = url;
    }
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[selected?.id]}
      className="nav-links-renderer sha-sidebar-menu"
      defaultOpenKeys={keys}
      onOpenChange={onOpenChange}
      theme={theme}
      items={items.map((item) =>
        renderSidebarMenuItem({ ...item, isItemVisible, navigate: handleNavigate, isRootItem: true })
      )}
    />
  );
};

export default SidebarMenu;
