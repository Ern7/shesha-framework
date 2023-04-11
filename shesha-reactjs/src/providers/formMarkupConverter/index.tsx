import React, { FC, ReactNode, useMemo } from 'react';
import { FormRawMarkup, IFlatComponentsStructure } from '../form/models';
import { componentsTreeToFlatStructure, getComponentsFromMarkup, upgradeComponents } from '../form/utils';
import { useFormDesignerComponents } from '../form/hooks';

export interface IFormMarkupConverterProps {
    markup: FormRawMarkup;
    children: (flatStructure: IFlatComponentsStructure, onChange: (flatStructure: IFlatComponentsStructure) => void) => ReactNode;
}

const FormMarkupConverter: FC<IFormMarkupConverterProps> = ({
    children,
    markup,
}) => {
    const designerComponents = useFormDesignerComponents();

    const flatComponents = useMemo<IFlatComponentsStructure>(() => {
        const components = getComponentsFromMarkup(markup);
        const newFlatComponents = componentsTreeToFlatStructure(designerComponents, components);
        
        // migrate components to last version
        upgradeComponents(designerComponents, newFlatComponents);
        
        return newFlatComponents;
    }, [markup]);

    const onChange = (_value: IFlatComponentsStructure) => {
        console.log('CONVERTER onChange');
    };

    return <>{children(flatComponents, onChange)}</>;
};

export { FormMarkupConverter };