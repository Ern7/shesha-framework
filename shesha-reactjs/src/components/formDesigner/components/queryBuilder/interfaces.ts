import { IConfigurableFormComponent } from '../../../../providers/form/models';

export interface IQueryBuilderComponentProps extends IConfigurableFormComponent {
    jsonExpanded?: boolean;
    useExpression?: boolean | string;
    modelType?: string;
    fieldsUnavailableHint?: string;
}