import React, { FC } from 'react';
import { Button } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import DragHandle from './dragHandle';
import ShaIcon, { IconType } from '../../../shaIcon';
import classNames from 'classnames';
import { IConfigurableItemBase, IConfigurableItemGroup } from '../../../../providers/itemListConfigurator/contexts';
import { useItemListConfigurator } from '../../../..';

export interface IContainerRenderArgs {
  index?: number[];
  id?: string;
  items: IConfigurableItemBase[];
}

export interface IListItemsGroupProps extends IConfigurableItemGroup {
  index: number[];
  containerRendering: (args: IContainerRenderArgs) => React.ReactNode;
}

export const ListItemsGroup: FC<IListItemsGroupProps> = ({ id, label, title, name, childItems, index, icon, containerRendering }) => {
  const { deleteGroup, selectedItemId } = useItemListConfigurator();

  const onDeleteClick = () => {
    deleteGroup(id);
  };

  return (
    <div className={classNames('sha-button-group-item', { selected: selectedItemId === id })}>
      <div className="sha-button-group-group-header">
        <DragHandle id={id} />

        {icon && <ShaIcon iconName={icon as IconType} />}

        <span className="sha-button-group-item-name">{title || label || name}</span>

        <div className="sha-button-group-item-controls">
          <Button icon={<DeleteFilled color="red" />} onClick={onDeleteClick} size="small" danger />
        </div>
      </div>

      <div className="sha-button-group-group-container">
        {containerRendering({ index: index, items: childItems || [], id: id })}
      </div>
    </div>
  );
};

export default ListItemsGroup;
