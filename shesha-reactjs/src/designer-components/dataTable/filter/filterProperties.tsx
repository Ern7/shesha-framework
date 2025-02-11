import { Empty, Form } from 'antd';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ConfigurableForm } from '../../../components';
import { FormMarkup } from '../../../providers/form/models';
import { useTableViewSelectorConfigurator } from '../../../providers/tableViewSelectorConfigurator';
import tableViewSettingsJson from './settings.json';

export interface IFilterProps {}

export const FilterProperties: FC<IFilterProps> = () => {
  const { selectedItemId, getItem, updateItem, readOnly } = useTableViewSelectorConfigurator();
  // note: we have to memoize the editor to prevent unneeded re-rendering and loosing of the focus
  const [editor, setEditor] = useState<ReactNode>(<></>);
  const [form] = Form.useForm();

  const debouncedSave = useDebouncedCallback(
    (values) => {
      updateItem({ id: selectedItemId, settings: values });
    },
    // delay in ms
    300
  );

  const getEditor = () => {
    const emptyEditor = null;
    if (!selectedItemId) return emptyEditor;

    const componentModel = getItem(selectedItemId);

    const onSettingsSave = (values) => {
      console.log(values);
    };

    return (
      <ConfigurableForm
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        mode={readOnly ? 'readonly' : 'edit'}
        markup={tableViewSettingsJson as FormMarkup}
        onFinish={onSettingsSave}
        form={form}
        initialValues={componentModel}
        onValuesChange={debouncedSave}
      />
    );
  };

  useEffect(() => {
    const currentEditor = getEditor();
    setEditor(currentEditor);
  }, [selectedItemId]);

  useEffect(() => {
    form.resetFields();
  }, [selectedItemId]);

  if (!Boolean(selectedItemId)) {
    return (
      <div>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Please select a component to begin editing" />
      </div>
    );
  }

  return <>{editor}</>;
};

export default FilterProperties;
