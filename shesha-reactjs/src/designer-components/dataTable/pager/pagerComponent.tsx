import { ControlOutlined } from '@ant-design/icons';
import { ITablePagerProps, TablePager } from 'components';
import React from 'react';
import { IToolboxComponent } from 'interfaces';
import { IConfigurableFormComponent } from 'providers/form/models';
import { validateConfigurableComponentSettings } from 'providers/form/utils';
import { getSettings } from './settingsForm';
import { migrateCustomFunctions, migratePropertyName } from 'designer-components/_common-migrations/migrateSettings';
import { migrateVisibility } from 'designer-components/_common-migrations/migrateVisibility';

export interface IPagerComponentProps extends ITablePagerProps, IConfigurableFormComponent {}

const PagerComponent: IToolboxComponent<IPagerComponentProps> = {
  type: 'datatable.pager',
  name: 'Table Pager',
  icon: <ControlOutlined />,
  Factory: ({ model }) => {
    if (model.hidden) return null;

    return <TablePager {...model} />;
  },
  initModel: (model: IPagerComponentProps) => {
    return {
      ...model,
      showSizeChanger: true,
      showTotalItems: true,
      items: [],
    };
  },  
  migrator:  m => m
    .add<IPagerComponentProps>(0, prev => ({...prev} as IPagerComponentProps))
    .add(1, (prev) => migratePropertyName(migrateCustomFunctions(prev)))
    .add<IPagerComponentProps>(2, (prev) => migrateVisibility(prev))
  ,
  settingsFormMarkup: context => getSettings(context),
  validateSettings: model => validateConfigurableComponentSettings(getSettings(model), model),
};

export default PagerComponent;
