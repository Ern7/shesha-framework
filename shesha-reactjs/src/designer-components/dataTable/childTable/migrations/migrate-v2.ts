import { IChildTableComponentProps } from "..";
import { SettingsMigrationContext } from "../../../../interfaces/formDesigner";
import { IButtonGroupItem, IButtonItem } from "../../../../providers/buttonGroupConfigurator/models";
import { upgradeActionConfig } from '../../../../components/formDesigner/components/_common-migrations/upgrade-action-owners';

export const migrateV1toV2 = (props: IChildTableComponentProps, context: SettingsMigrationContext): IChildTableComponentProps => {
    const { toolbarItems } = props;

    const newToolbarItems = toolbarItems?.map(item => {
        if (item.itemType !== "item")
            return item;

        const button = item as IButtonGroupItem;
        if (button.itemSubType !== 'button')
            return button;
            
        return { ...button, actionConfiguration: upgradeActionConfig((button as IButtonItem).actionConfiguration, context) };
    });

    return { ...props, toolbarItems: newToolbarItems ?? [] };
};
