import { AutoComplete, Checkbox, Input, InputNumber, Select, Switch, } from 'antd';
import React, { FC, useState } from 'react';
import PropertyAutocomplete from 'components/propertyAutocomplete/propertyAutocomplete';
import CodeEditor from 'components/formDesigner/components/codeEditor/codeEditor';
import Show from 'components/show';
import { Autocomplete } from 'components/autocomplete';
import FormAutocomplete from 'components/formAutocomplete';
import EndpointsAutocomplete from 'components/endpointsAutocomplete/endpointsAutocomplete';
import { MetadataProvider, useForm } from 'providers';
import LabelValueEditor from 'components/formDesigner/components/labelValueEditor/labelValueEditor';
import CollapsiblePanel from 'components/panel';
import { ConfigurableActionConfigurator } from '../configurableActionsConfigurator/configurator';
import { ISettingsFormFactoryArgs } from 'interfaces';
import { IEntityReferenceControlProps } from './entityReference';
import SettingsFormItem from '../../designer-components/_settings/settingsFormItem';
import SettingsCollapsiblePanel from '../../designer-components/_settings/settingsCollapsiblePanel';
import SettingsForm, { useSettingsForm } from '../../designer-components/_settings/settingsForm';
import { ContextPropertyAutocomplete } from '../../designer-components/contextPropertyAutocomplete';
import { useFormDesigner } from 'providers/formDesigner';

const formTypes = ['Table', 'Create', 'Edit', 'Details', 'Quickview', 'ListItem', 'Picker'];

export const EntityReferenceSettingsForm: FC<ISettingsFormFactoryArgs<IEntityReferenceControlProps>> = (props) => {
  return (
    SettingsForm<IEntityReferenceControlProps>({...props, children: <EntityReferenceSettings {...props}/>})
  );
};

const EntityReferenceSettings: FC<ISettingsFormFactoryArgs<IEntityReferenceControlProps>> = ({readOnly}) => {
  const { model: state, getFieldsValue, onValuesChange } = useSettingsForm<IEntityReferenceControlProps>();

  const designerModelType = useFormDesigner(false)?.formSettings?.modelType;
  const { formSettings } = useForm();

  const [formTypesOptions, setFormTypesOptions] = useState<{ value: string }[]>(
    formTypes.map(i => {
      return { value: i };
    })
  );

  const formData = getFieldsValue();

  return (
    <>
    <SettingsCollapsiblePanel header='Display'>
        <ContextPropertyAutocomplete id="fb71cb51-884f-4f34-aa77-820c12276c95"
          readOnly={readOnly} 
          defaultModelType={designerModelType ?? formSettings.modelType}
          formData={formData}
          onValuesChange={onValuesChange}
        />

      <SettingsFormItem name="label" label="Label" jsSetting>
        <Input readOnly={readOnly} />
      </SettingsFormItem>

      <SettingsFormItem name="labelAlign" label="Label align" jsSetting>
        <Select disabled={readOnly}>
          <Select.Option value="left">left</Select.Option>
          <Select.Option value="right">right</Select.Option>
        </Select>
      </SettingsFormItem>

      <SettingsFormItem name="description" label="Description" jsSetting>
        <Input readOnly={readOnly} />
      </SettingsFormItem>
    </SettingsCollapsiblePanel>

    <SettingsCollapsiblePanel header='Entity reference configuration'>
      <SettingsFormItem name="placeholder" label="Placeholder" jsSetting>
        <Input readOnly={readOnly} />
      </SettingsFormItem>

      <SettingsFormItem name="getEntityUrl" label="Get entity URL" jsSetting>
        <EndpointsAutocomplete readOnly={readOnly} />
      </SettingsFormItem>

      <SettingsFormItem name="entityType" label="Entity type" style={{width: '100%'}} jsSetting>
        <Autocomplete.Raw
          dataSourceType="url"
          dataSourceUrl="/api/services/app/Metadata/TypeAutocomplete"
          readOnly={readOnly}
        />
      </SettingsFormItem>

      <MetadataProvider modelType={state?.entityType}>
        <SettingsFormItem name="displayProperty" label="Display property"  jsSetting>
          <PropertyAutocomplete readOnly={readOnly} showFillPropsButton={false} />
        </SettingsFormItem>
      </MetadataProvider>

      <SettingsFormItem name="entityReferenceType" initialValue={'Quickview'} label="Entity Reference Type">
        <Select disabled={readOnly}>
          <Select.Option value="Quickview">Quickview</Select.Option>
          <Select.Option value="NavigateLink">Navigate Link</Select.Option>
          <Select.Option value="Dialog">Modal dialog box</Select.Option>
        </Select>
      </SettingsFormItem>

      <SettingsFormItem name="formSelectionMode" initialValue={'name'} label="Form selection mode">
        <Select disabled={readOnly}>
          <Select.Option value="name">Name</Select.Option>
          <Select.Option value="dynamic">Dynamic</Select.Option>
        </Select>
      </SettingsFormItem>

      {state?.formSelectionMode === 'dynamic' && (
        <SettingsFormItem name="formType" label="Form type" jsSetting>
          <AutoComplete
            disabled={readOnly}
            options={formTypesOptions}
            onSearch={t =>
              setFormTypesOptions(
                (t
                  ? formTypes.filter(f => {
                    return f.toLowerCase().includes(t.toLowerCase());
                  })
                  : formTypes
                ).map(i => {
                  return { value: i };
                })
              )
            }
          />
        </SettingsFormItem>
      )}
      {(state?.formSelectionMode === 'name') && (
        <SettingsFormItem name="formIdentifier" label="Form" jsSetting>
          <FormAutocomplete readOnly={readOnly} convertToFullId={true} />
        </SettingsFormItem>
      )}
    </SettingsCollapsiblePanel>

    <Show when={state?.entityReferenceType === 'Quickview'}>
      <SettingsCollapsiblePanel header='Quickview settings'>
        <SettingsFormItem name="quickviewWidth" label="Quickview width" jsSetting>
          <InputNumber min={0} defaultValue={600} step={1} readOnly={readOnly} />
        </SettingsFormItem>
      </SettingsCollapsiblePanel>
    </Show>

    <Show when={state?.entityReferenceType === 'Dialog'}>
      <SettingsCollapsiblePanel header='Dialog settings'>
        <SettingsFormItem name="modalTitle" label="Title" jsSetting>
          <Input readOnly={readOnly} />
        </SettingsFormItem>

        <SettingsFormItem name="showModalFooter" label="Show Modal Buttons" valuePropName="checked" jsSetting>
          <Checkbox disabled={readOnly} />
        </SettingsFormItem>

        {state?.showModalFooter &&
          <SettingsFormItem name="submitHttpVerb" initialValue={'POST'} label="Submit Http Verb" jsSetting>
            <Select disabled={readOnly}>
              <Select.Option value="POST">POST</Select.Option>
              <Select.Option value="PUT">PUT</Select.Option>
            </Select>
          </SettingsFormItem>
        }
        <SettingsFormItem name="additionalProperties" label="Additional properties" jsSetting>
          <LabelValueEditor
            labelName='key'
            labelTitle='Key'
            valueName='value'
            valueTitle='Value'
            description={'Additional properties you want to be passed when the form gets submitted like parentId in the case where the modal is used in a childTable. ' +
              'Also note you can use Mustache expression like {{id}} for value property. \n\n' +
              'Id initial value is already initialised with {{entityReference.id}} but you can override it'
            }
            exposedVariables={[
              {name: 'data', description: 'This form data', type: 'object'},
              {name: 'form', description: 'Form instance', type: 'object'},
              {name: 'formMode', description: 'Current form mode', type: "'designer' | 'edit' | 'readonly'"},
              {name: 'globalState', description: 'Global state', type: 'object'},
              {name: 'entityReference.id', description: 'Id of entity reference entity', type: 'object'},
              {name: 'entityReference.entity', description: 'Entity', type: 'object'},
              {name: 'moment', description: 'moment', type: ''},
              {name: 'http', description: 'axiosHttp', type: ''},
            ]}
          />
        </SettingsFormItem>

        <SettingsFormItem name="modalWidth" label="Dialog Width (%)" jsSetting>
          <Select disabled={readOnly}>
            <Select.Option value="40%">Small</Select.Option>
            <Select.Option value="60%">Medium</Select.Option>
            <Select.Option value="80%">Large</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
        </SettingsFormItem>
        {state?.modalWidth === 'custom' &&
          <>
            <SettingsFormItem name="widthUnits" label="Units" jsSetting>
              <Select disabled={readOnly}>
                <Select.Option value="%">Percentage (%)</Select.Option>
                <Select.Option value="px">Pixels (px)</Select.Option>
              </Select>
            </SettingsFormItem>
            <SettingsFormItem name="customWidth" label="Enter Custom Width">
              <InputNumber min={0} readOnly={readOnly} />
            </SettingsFormItem>
          </>
        }

        <SettingsFormItem name="handleSuccess" label="Handle Success" valuePropName="checked">
          <Switch />
        </SettingsFormItem>
        {state?.handleSuccess &&
          <CollapsiblePanel header="On Success handler">
            <SettingsFormItem name="onSuccess" label="On Success">
              <ConfigurableActionConfigurator editorConfig={null} level={0} />
            </SettingsFormItem>
          </CollapsiblePanel>
        }

        <SettingsFormItem name="handleFail" label="Handle Fail" valuePropName="checked">
          <Switch />
        </SettingsFormItem>
        {state?.handleFail &&
          <CollapsiblePanel header="On Fail handler">
            <SettingsFormItem name="onFail" label="On Fail">
              <ConfigurableActionConfigurator editorConfig={null} level={0} />
            </SettingsFormItem>
          </CollapsiblePanel>
        }
      </SettingsCollapsiblePanel>
    </Show>

    <SettingsCollapsiblePanel header='Layout'>
      <SettingsFormItem name="labelCol" label="Label Col" jsSetting>
        <InputNumber min={0} max={24} defaultValue={8} step={1} readOnly={readOnly} />
      </SettingsFormItem>

      <SettingsFormItem name="wrapperCol" label="Wrapper Col" jsSetting>
        <InputNumber min={0} max={24} defaultValue={16} step={1} readOnly={readOnly} />
      </SettingsFormItem>

      <SettingsFormItem name="style" label="Style">
        <CodeEditor
          readOnly={readOnly}
          mode="dialog"
          label="Style"
          setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
          propertyName="style"
          description="CSS Style"
          exposedVariables={[
            {
              id: '788673a5-5eb9-4a9a-a34b-d8cea9cacb3c',
              name: 'data',
              description: 'Form data',
              type: 'object',
            },
          ]}
        />
      </SettingsFormItem>
    </SettingsCollapsiblePanel>

    <SettingsCollapsiblePanel header='Visibility'>
      <SettingsFormItem name="disabled" label="Disabled" valuePropName="checked" jsSetting>
        <Checkbox disabled={readOnly} />
      </SettingsFormItem>

      <SettingsFormItem name="hidden" label="Hidden" valuePropName="checked" jsSetting>
        <Checkbox disabled={readOnly} />
      </SettingsFormItem>

      <SettingsFormItem name="hideLabel" label="Hide Label" valuePropName="checked" jsSetting>
        <Checkbox disabled={readOnly} />
      </SettingsFormItem>
    </SettingsCollapsiblePanel>
    </>
  );
};
