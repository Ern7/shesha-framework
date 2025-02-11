import { ButtonGroupItemProps, IDynamicItem } from "providers/buttonGroupConfigurator/models";
import { ComponentType, FC } from "react";
import { IDynamicActionsRegistration } from "./contexts";

export interface IProvidersDictionary {
  [key: string]: IDynamicActionsRegistration;
}

export interface DynamicAction {
  
}

export interface IHasActions {
  items: ButtonGroupItemProps[]; // todo: make a generic interface with minimal number of properties, ButtonGroupItemProps will implement/extend this interface
}

export type DynamicRenderingHoc = <T>(WrappedComponent: ComponentType<T & IHasActions>) => FC<T>;

export interface DynamicItemsEvaluationHookArgs {
  item: IDynamicItem;
}
export type DynamicItemsEvaluationHook = (args: DynamicItemsEvaluationHookArgs) => ButtonGroupItemProps[];