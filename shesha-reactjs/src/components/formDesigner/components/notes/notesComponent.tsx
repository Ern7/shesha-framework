import { IToolboxComponent } from 'interfaces';
import { FormMarkup, IConfigurableFormComponent } from 'providers/form/models';
import { FormOutlined } from '@ant-design/icons';
import settingsFormJson from './settingsForm.json';
import { NotesRenderer, useFormData } from '../../../../';
import { evaluateValue, validateConfigurableComponentSettings } from 'providers/form/utils';
import React from 'react';
import NotesProvider from 'providers/notes';
import { migrateCustomFunctions, migrateFunctionToProp, migratePropertyName } from 'designer-components/_common-migrations/migrateSettings';
import { migrateVisibility } from 'designer-components/_common-migrations/migrateVisibility';

export interface INotesProps extends IConfigurableFormComponent {
  ownerId: string;
  ownerType: string;
  ownerIdExpression: string;
  ownerTypeExpression: string;
  savePlacement?: 'left' | 'right';
  autoSize?: boolean;
}

const settingsForm = settingsFormJson as FormMarkup;

const NotesComponent: IToolboxComponent<INotesProps> = {
  type: 'notes',
  name: 'Notes',
  icon: <FormOutlined />,
  Factory: ({ model }) => {
    const { data } = useFormData();

    // TODO:: Change to use Mustache
    const ownerId = evaluateValue(model.ownerId, { data });

    if (model.hidden) return null;

    return (
      <NotesProvider ownerId={ownerId} ownerType={model.ownerType}>
        <NotesRenderer
          showCommentBox={model.disabled !== true}
          buttonPostion={model?.savePlacement}
          autoSize={model?.autoSize}
        />
      </NotesProvider>
    );
  },
  validateSettings: (model) => validateConfigurableComponentSettings(settingsForm, model),
  initModel: (model) => {
    const customModel: INotesProps = {
      ...model,
      ownerId: '{data.id}',
      ownerType: '',
    };
    return customModel;
  },
  settingsFormMarkup: settingsForm,
  migrator: (m) => m
    .add<INotesProps>(0, (prev) =>
      migratePropertyName(
        migrateCustomFunctions(
          migrateFunctionToProp(
            migrateFunctionToProp(prev, 'ownerId', 'ownerIdExpression')
            , 'ownerType', 'ownerTypeExpression')
        )) as INotesProps)
    .add<INotesProps>(1, (prev) => migrateVisibility(prev)),
};

export default NotesComponent;
