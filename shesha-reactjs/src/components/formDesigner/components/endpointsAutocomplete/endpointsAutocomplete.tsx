import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup } from '../../../../providers/form/models';
import { ApiOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import React from 'react';
import { evaluateValue, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm, useFormData } from '../../../../providers';
import ReadOnlyDisplayFormItem from '../../../readOnlyDisplayFormItem';
import { EndpointsAutocomplete } from '../../../endpointsAutocomplete/endpointsAutocomplete';
import { IEndpointsAutocompleteComponentProps } from './interfaces';

const settingsForm = settingsFormJson as FormMarkup;

const EndpointsAutocompleteComponent: IToolboxComponent<IEndpointsAutocompleteComponentProps> = {
  type: 'endpointsAutocomplete',
  name: 'API Endpoints Autocomplete',
  icon: <ApiOutlined />,
  isHidden: true,
  factory: (model: IEndpointsAutocompleteComponentProps, _c, _form) => {
    const { formMode, isComponentDisabled } = useForm();
    const { data: formData } = useFormData();

    const disabled = isComponentDisabled(model);

    const readOnly = model?.readOnly || formMode === 'readonly';
    const verb = model.httpVerb ? evaluateValue(model.httpVerb, { data: formData }) : model.httpVerb;

    return (
      <ConfigurableFormItem model={model}>
        {readOnly ? (
          <ReadOnlyDisplayFormItem disabled={disabled} />
        ) : (
          <EndpointsAutocomplete {...model} httpVerb={verb} />
        )}
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
};

export default EndpointsAutocompleteComponent;
