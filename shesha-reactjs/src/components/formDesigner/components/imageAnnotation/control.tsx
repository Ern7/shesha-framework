import React, { FC, useEffect, useRef, useState } from 'react';
import { ReactPictureAnnotation } from 'react-picture-annotation';
import { usePrevious } from '../../../../hooks';
import { useForm, useFormData, useGlobalState } from '../../../../providers';
import { getString, getStyle } from '../../../../providers/form/utils';
import CustomInput from './components/customAnnotationInput';
import DescriptionsList from './components/descriptionList';
import WarningMessage from './components/warningMessage';

import { IAnnotation, IImageAnnotationData, IImageProps } from './model';
import './styles/index.less';
import { canSubmit, getCustomEnabled, getViewData, parseIntOrDefault, sortAnnotationData } from './utilis';
import { name } from 'pubsub-js';


interface IProps {
  model: IImageProps;
  onChange?: Function;
  value?: any;
}

const ImageAnnotationControl: FC<IProps> = ({ model, onChange: onChangeForm, value }) => {
  const { isOnImage, height, width, allowAddingNotes = true, minPoints = 0, maxPoints = 0, disabled, customEnabled, style } = model;

  const { data: formData } = useFormData();

  const { globalState } = useGlobalState();

  const { formMode } = useForm();

  const imageFrameRef = useRef<HTMLDivElement>(null);

  const [pageSize, setPageSize] = useState({
    width: parseIntOrDefault(width),
    height: parseIntOrDefault(height),
  });

  const [imageAnnotationData, setImageAnnotationData] = useState<IImageAnnotationData>({
    actualData: value || [],
    viewData: value || [],
  });

  const prevLeghth = usePrevious(imageAnnotationData?.viewData?.length);

  const isCustomEnabled = getCustomEnabled(customEnabled, name, formData, globalState, formMode);

  const isReadOnly = model?.readOnly || formMode === 'readonly' || disabled || !isCustomEnabled;


  useEffect(() => {
    window.addEventListener('resize', onResize);
    const isNumbersOnly = !isOnImage && isReadOnly;
    if (isNumbersOnly) {
      setImageAnnotationData({
        ...imageAnnotationData,
        viewData: getViewData(imageAnnotationData.actualData, allowAddingNotes),
      });
    } else {
      setImageAnnotationData({
        ...imageAnnotationData,
        viewData: imageAnnotationData.actualData,
      });
    }
    return () => window.removeEventListener('resize', onResize);
  }, [isReadOnly]);

  useEffect(() => {
    setPageSize(() => ({
      width: parseIntOrDefault(width),
      height: parseIntOrDefault(height),
    }));
  }, [height, width]);


  const url: string = getString(model?.url, formData, globalState) || formData?.[model.name];

  const onResize = () => {
    setPageSize({
      width: parseIntOrDefault(imageFrameRef?.current?.offsetWidth),
      height: parseIntOrDefault(imageFrameRef?.current?.offsetHeight),
    });
  };


  const setIsRequired = (required: boolean) => {

    model.validate.required = required;

    model.validate.message = `Enter a minimum of ${minPoints || 1} points`;

    //This force instant update of the form validation
    const imageElement = imageFrameRef?.current?.getElementsByClassName('rp-stage')[0]?.getElementsByClassName('rp-shapes')[0] as HTMLDivElement;

    imageElement?.click();


  };

  const onSelect = () => { };


  const onChange = (data: IAnnotation[]) => {
    if (!isReadOnly) {

      if (!!maxPoints && maxPoints < data.length) return;
      const recordedData = data?.filter(({ comment }) => !!comment);

      setImageAnnotationData({
        viewData: allowAddingNotes ? data : getViewData(sortAnnotationData(data), allowAddingNotes),
        actualData: recordedData,
      });

      if (canSubmit(data, minPoints)) {

        setIsRequired(false);

        onChangeForm(sortAnnotationData(data));

      } else {

        const recordeddata = data?.filter(({ comment }) => !!comment)?.length;

        if (!!minPoints && minPoints > recordeddata) {

          setIsRequired(true);
        }

        onChangeForm([]);
      }
    }
  };


  const hasUpdated = prevLeghth != imageAnnotationData?.viewData?.length;

  const maxReached = !!maxPoints && imageAnnotationData?.viewData?.filter(({ comment }) => !!comment).length == maxPoints;


  return (<>
    <WarningMessage
      isReadonly={isReadOnly}
      maxPoints={maxPoints}
      maxReached={maxReached}
      width={pageSize?.width}
    />
    <div className="annotation-conatainer">

      <div className="container-image" ref={imageFrameRef} style={{ ...pageSize, ...getStyle(style, formData, globalState) }}>

        <ReactPictureAnnotation
          inputElement={(value, onChange, onDelete) => (
            <CustomInput
              value={value}
              defaultNumber={imageAnnotationData?.viewData?.length}
              onChange={onChange}
              onDelete={onDelete}
            />
          )}
          annotationData={
            hasUpdated ? sortAnnotationData(imageAnnotationData.viewData) : imageAnnotationData.viewData
          }
          image={url}
          onSelect={onSelect}
          onChange={onChange}
          width={parseIntOrDefault(imageFrameRef?.current?.offsetWidth)}
          height={parseIntOrDefault(imageFrameRef?.current?.offsetHeight)}
          marginWithInput={2}
        />
      </div>
      {isReadOnly && <div className="container-image-Cover" style={{ ...pageSize }} />}

    </div>

    {!isOnImage && allowAddingNotes && (
      <div
        className="description-container"
        style={{
          height: pageSize.height,
        }}
      >
        <DescriptionsList data={sortAnnotationData(imageAnnotationData?.actualData)} />
      </div>
    )}


  </>
  );
};

export default ImageAnnotationControl;
