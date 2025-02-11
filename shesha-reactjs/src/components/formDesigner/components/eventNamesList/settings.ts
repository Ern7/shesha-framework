import { DesignerToolbarSettings } from '../../../../interfaces/toolbarSettings';

export const alertSettingsForm = new DesignerToolbarSettings()
  .addSectionSeparator({
    id: 'b8954bf6-f76d-4139-a850-c99bf06c8b69',
    propertyName: 'separator1',
    parentId: 'root',
    label: 'Display',
  })
  .addContextPropertyAutocomplete({
    id: '5c813b1a-04c5-4658-ac0f-cbcbae6b3bd4',
    propertyName: 'propertyName',
    parentId: 'root',
    label: 'Property name',
    validate: { required: true },
  })
  .addDropdown({
    id: 'f6c3d710-8d98-47fc-9fe2-7c6312e9a03c',
    propertyName: 'alertType',
    parentId: 'root',
    hidden: false,
    label: 'Type',
    useRawValues: false,
    dataSourceType: 'values',
    values: [
      { id: '17a865b3-8e28-41de-ab40-1fc49a56b31d', label: 'Success', value: 'success' },
      { id: 'edeb7d32-f942-41cc-a941-07b8882d8faa', label: 'Info', value: 'info' },
      { id: 'df342c95-4dae-49a5-beff-259d0f2ebcb3', label: 'Warning', value: 'warning' },
      { id: '21fc57e5-5e5d-4ae8-83c4-080a15b55176', label: 'Error', value: 'error' },
    ],
    validate: { required: true },
  })
  .addTextArea({
    id: '277b7ffe-d023-4543-a4b4-ff7f76052867',
    propertyName: 'text',
    parentId: 'root',
    hidden: false,
    label: 'Text',
    autoSize: false,
    showCount: false,
    allowClear: false,
    validate: { required: true },
  })
  .addTextArea({
    id: '8340f638-c466-448e-99cd-fb8c544fe02a',
    propertyName: 'description',
    parentId: 'root',
    hidden: false,
    label: 'Description',
    autoSize: false,
    showCount: false,
    allowClear: true,
  })
  .addCheckbox({
    id: '65aef83a-ea37-480a-9d77-ee4f4e229a70',
    propertyName: 'showIcon',
    parentId: 'root',
    label: 'Show Icon',
  })
  .addCheckbox({
    id: '148e12c0-41a0-4fa2-8c64-8f6dd5213a3e',
    propertyName: 'closable',
    label: 'Closable',
    parentId: 'root',
  })
  .addIconPicker({
    id: '152f3d72-68fb-43ab-adf6-8cf7d11fe6e1',
    propertyName: 'icon',
    label: 'Icon',
    parentId: 'root',
  })
  .addSectionSeparator({
    id: '516d72e1-3dfd-433f-8459-8b1610c3c9cb',
    propertyName: 'separatorStyle',
    parentId: 'root',
    label: 'Style',
  })
  .addCodeEditor({
    id: '987c3de1-b959-4670-96f6-9b1747189a6e',
    propertyName: 'style',
    label: 'Style',
    parentId: 'root',
    mode: 'dialog',
  })
  .toJson();
