import React, { FC, useRef } from 'react';
import { Select, Input, RefSelectProps, Checkbox } from 'antd';
import EditableTagGroup from '../../../editableTagGroup';
import { IWizardStepProps, IWizardComponentProps } from './models';
import ItemListSettingsModal from '../itemListConfigurator/itemListSettingsModal';
import { getSettings } from './itemSettings';
import { nanoid } from 'nanoid/non-secure';
import SettingsForm, { useSettingsForm } from '../../../../designer-components/_settings/settingsForm';
import SettingsFormItem from '../../../../designer-components/_settings/settingsFormItem';
import { ISettingsFormFactoryArgs } from 'interfaces';
import SettingsCollapsiblePanel from '../../../../designer-components/_settings/settingsCollapsiblePanel';
import { CodeEditor } from 'components';

const { Option } = Select;

export const WizardSettingsForm: FC<ISettingsFormFactoryArgs<IWizardComponentProps>> = (props) => {
  return SettingsForm<IWizardComponentProps>({ ...props, children: <WizardSettings {...props} /> });
};

const WizardSettings: FC<ISettingsFormFactoryArgs<IWizardComponentProps>> = (props) => {
  const { readOnly } = props;

  const { model: state /*, getFieldsValue, onValuesChange*/ } = useSettingsForm<IWizardComponentProps>();

  /*const onValuesChange = (changedValues: any, values: IWizardComponentProps) => {
    // whenever the tabs change, check to see if `defaultActiveStep` is still present within the tabs. If not, remove it
    const foundIndex = values?.defaultActiveStep
      ? values?.steps?.findIndex(item => item?.id === values?.defaultActiveStep)
      : 0;

    const newValues = { ...state, ...values, defaultActiveStep: foundIndex < 0 ? null : values?.defaultActiveStep };

    setState(prev => ({ ...prev, ...values, defaultActiveStep: foundIndex < 0 ? null : values?.defaultActiveStep }));

    if (props.onValuesChange) props.onValuesChange(changedValues, newValues);
  };*/

  const onAddNewItem = (_, count: number) => {
    const buttonProps: IWizardStepProps = {
      id: nanoid(),
      itemType: 'item',
      sortOrder: count,
      name: `step${count + 1}`,
      label: `Step ${count + 1}`,
      key: `stepKey${count + 1}`,
      title: `Step ${count + 1}`,
      subTitle: `Sub title ${count + 1}`,
      description: `Description ${count + 1}`,
      nextButtonText: 'Next',
      backButtonText: 'Back',
      components: [],
    };

    return buttonProps;
  };

  const steps = props?.model?.steps?.map((item) => ({ ...item, label: item?.title }));

  const selectRef = useRef<RefSelectProps>();

  return (
    <>
      <SettingsCollapsiblePanel header="Display">
        <SettingsFormItem name="componentName" label="Component name" required={true}>
          <Input disabled={readOnly} />
        </SettingsFormItem>

        <SettingsFormItem name="wizardType" label="Wizard Type" jsSetting>
          <Select allowClear disabled={readOnly}>
            <Option value="default">Default</Option>
            <Option value="navigation">Navigation</Option>
          </Select>
        </SettingsFormItem>

        <SettingsFormItem name="size" jsSetting label="Size" tooltip="This will set the size for all buttons">
          <Select disabled={readOnly}>
            <Option value="default">default</Option>
            <Option value="small">small</Option>
          </Select>
        </SettingsFormItem>

        <SettingsFormItem
          name="direction"
          jsSetting
          label="Direction"
          tooltip="To specify the direction of the step bar"
        >
          <Select disabled={readOnly}>
            <Option value="vertical">vertical</Option>
            <Option value="horizontal">horizontal</Option>
          </Select>
        </SettingsFormItem>

        <SettingsFormItem
          name="labelPlacement"
          jsSetting
          label="Label Placement"
          tooltip="To specify the label placement"
        >
          <Select disabled={readOnly}>
            <Option value="vertical">vertical</Option>
            <Option value="horizontal">horizontal</Option>
          </Select>
        </SettingsFormItem>

        <SettingsFormItem
          name="defaultActiveStep"
          jsSetting
          label="Default Active Step"
          tooltip="This will be the default step tha"
        >
          <Select allowClear ref={selectRef} value={state?.defaultActiveStep} disabled={readOnly}>
            {state?.steps?.map(({ id, title }) => (
              <Option value={id} key={id}>
                {title}
              </Option>
            ))}
          </Select>
        </SettingsFormItem>

        <SettingsFormItem
          name="buttonsLayout"
          jsSetting
          label="Buttons Layout"
          tooltip="How you want the steps buttons to be aligned"
        >
          <Select disabled={readOnly}>
            <Option value="left">Left</Option>
            <Option value="right">Right</Option>
            <Option value="spaceBetween">Space Between</Option>
          </Select>
        </SettingsFormItem>

        <SettingsFormItem name="hidden" label="Hidden" valuePropName="checked" jsSetting>
          <Checkbox disabled={readOnly} />
        </SettingsFormItem>
      </SettingsCollapsiblePanel>

      <SettingsCollapsiblePanel header="Configure Wizard Steps">
        <SettingsFormItem name="steps" initialValue={steps}>
          <ItemListSettingsModal
            options={{ onAddNewItem }}
            title="Configure Wizard Steps"
            heading="Settings"
            callToAction="Configure Wizard Steps"
            itemTypeMarkup={getSettings()}
            allowAddGroups={false}
            insertMode="after"
          />
        </SettingsFormItem>
      </SettingsCollapsiblePanel>

      <SettingsCollapsiblePanel header="Security">
        <SettingsFormItem
          jsSetting
          label="Permissions"
          name="permissions"
          initialValue={props.model.permissions}
          tooltip="Enter a list of permissions that should be associated with this component"
        >
          <EditableTagGroup disabled={readOnly} />
        </SettingsFormItem>
      </SettingsCollapsiblePanel>

      <SettingsCollapsiblePanel header="Style">
        <SettingsFormItem
          label="Style"
          name="style"
          tooltip="A script that returns the style of the element as an object. This should conform to CSSProperties"
        >
          <CodeEditor
            propertyName="style"
            readOnly={readOnly}
            mode="dialog"
            label="Style"
            setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
            description="A script that returns the style of the element as an object. This should conform to CSSProperties"
            exposedVariables={[
              {
                id: 'f9f25102-bdc7-41bc-b4bc-87eea6a86fc5',
                name: 'data',
                description: 'Selected form values',
                type: 'object',
              },
              {
                id: '6374545e-4848-4e92-9846-27f2a7884c41',
                name: 'globalState',
                description: 'The global state of the application',
                type: 'object',
              },
            ]}
          />
        </SettingsFormItem>
      </SettingsCollapsiblePanel>
    </>
  );
};

export default WizardSettingsForm;
