import React, { FC, useContext, PropsWithChildren, useRef } from 'react';
import metadataReducer from './reducer';
import {
  MetadataDispatcherActionsContext,
  MetadataDispatcherStateContext,
  METADATA_DISPATCHER_CONTEXT_INITIAL_STATE,
  IMetadataDispatcherStateContext,
  IMetadataDispatcherActionsContext,
  IGetMetadataPayload,
  IRegisterProviderPayload,
  IGetNestedPropertiesPayload,
  IGetPropertyMetadataPayload,
  IGetPropertiesMetadataPayload,
} from './contexts';
import {
  activateProviderAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import useThunkReducer from '../../hooks/thunkReducer';
import { metadataGet, PropertyMetadataDto } from '../../apis/metadata';
import { IModelsDictionary, IProvidersDictionary } from './models';
import { useSheshaApplication } from '../../providers';
import { IModelMetadata, IPropertyMetadata, ISpecification } from '../../interfaces/metadata';
import camelcase from 'camelcase';
import { DataTypes } from '../../interfaces/dataTypes';
import { IDictionary } from '../../interfaces';

export interface IMetadataDispatcherProviderProps { }

const MetadataDispatcherProvider: FC<PropsWithChildren<IMetadataDispatcherProviderProps>> = ({ children }) => {
  const initial: IMetadataDispatcherStateContext = {
    ...METADATA_DISPATCHER_CONTEXT_INITIAL_STATE,
  };

  const providers = useRef<IProvidersDictionary>({});
  const models = useRef<IModelsDictionary>({});
  //const specifications = useRef<ISpecificationsDictionary>({});

  const [state, dispatch] = useThunkReducer(metadataReducer, initial);

  const { backendUrl, httpHeaders } = useSheshaApplication();
  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const mapProperty = (property: PropertyMetadataDto, prefix: string = ''): IPropertyMetadata => {
    return {
      ...property,
      path: property.path,
      prefix,
      properties: property.properties?.map(child => mapProperty(child, property.path)),
    };
  };

  const getMetadata = (payload: IGetMetadataPayload) => {
    const { modelType } = payload;
    const loadedModel = models.current[payload.modelType];
    if (loadedModel) return loadedModel;

    const metaPromise = new Promise<IModelMetadata>((resolve, reject) => {
      metadataGet({ container: modelType }, { base: backendUrl, headers: httpHeaders })
        .then(response => {
          if (!response.success) {
            reject(response.error);
          }

          const properties = response.result.properties.map<IPropertyMetadata>(p => mapProperty(p));
          const specifications = response.result.specifications.map<ISpecification>(s => ({
            name: s.name,
            friendlyName: s.friendlyName,
            description: s.description,
          }));
          const apiEndpoints = {};
          for (const actionName in response.result.apiEndpoints) {
            if (response.result.apiEndpoints.hasOwnProperty(actionName)){
              const endpoint = response.result.apiEndpoints[actionName];
              if (endpoint)
                apiEndpoints[actionName] = { ...endpoint };
            }
          }

          const meta: IModelMetadata = {
            type: payload.modelType,
            dataType: response.result.dataType,
            name: payload.modelType, // todo: fetch name from server
            properties,
            specifications,
            apiEndpoints,
          };

          resolve(meta);
        })
        .catch(e => {
          reject(e);
        });
    });
    models.current[payload.modelType] = metaPromise;

    return metaPromise;
  };

  const getPropertyByName = (properties: IPropertyMetadata[], name: string): IPropertyMetadata => {
    return properties?.find(p => camelcase(p.path) === name);
  };

  const extractNestedProperty = (mainProperty: IPropertyMetadata, name: string): Promise<IPropertyMetadata> => {
    return mainProperty.dataType === 'entity'
      ? getMetadata({ modelType: mainProperty.entityType }).then(entityMeta => {
        return getPropertyByName(entityMeta?.properties, name);
      })
      : Promise.resolve(getPropertyByName(mainProperty.properties, name));
  };

  const getPropertyMetadata = (payload: IGetPropertyMetadataPayload): Promise<IPropertyMetadata> => {
    const { modelType, propertyPath } = payload;

    const pathParts = propertyPath.split('.');
    if (pathParts.length === 0)
      return Promise.reject('Failed to build property path');

    // get container metadata
    const rootMetaPromise = getMetadata({ modelType: modelType });
    // get first level property and its metadata
    const level1 = pathParts.shift();
    const level1Promise = rootMetaPromise.then(m => {
      const propertyMeta = getPropertyByName(m?.properties, level1);
      return propertyMeta;
    });

    // run full chain of properties starting from the first one
    const result = pathParts.reduce((a, c) => {
      return a.then(m => extractNestedProperty(m, c));
    }, level1Promise);

    return result;
  };


  interface IPropertyPathWithMetadata {
    path: string;
    metadata: IPropertyMetadata;
  }
  const getPropertiesMetadata = (payload: IGetPropertiesMetadataPayload): Promise<IDictionary<IPropertyMetadata>> => {
    const { properties, modelType } = payload;

    const promises = properties.map(p => getPropertyMetadata({ modelType: modelType, propertyPath: p })
      .then<IPropertyPathWithMetadata>(propMeta => ({ path: p, metadata: propMeta }))
    );

    return Promise.allSettled(promises).then(results => {
      const dictionary: IDictionary<IPropertyMetadata> = {};
      results.filter(r => r.status === 'fulfilled').forEach(r => {
        const pathWithMeta = (r as PromiseFulfilledResult<IPropertyPathWithMetadata>)?.value;
        if (pathWithMeta)
          dictionary[pathWithMeta.path] = pathWithMeta.metadata;
      });

      return dictionary;
    });
  };

  const registerProvider = (payload: IRegisterProviderPayload) => {
    const existingProvider = providers.current[payload.id];
    if (!existingProvider) {
      providers.current[payload.id] = {
        id: payload.id,
        modelType: payload.modelType,
        contextValue: payload.contextValue,
      };
    } else {
      existingProvider.modelType = payload.modelType;
      existingProvider.contextValue = payload.contextValue;
    }
  };

  const activateProvider = (providerId: string) => {
    dispatch(activateProviderAction(providerId));
  };

  const getActiveProvider = () => {
    const registration = state.activeProvider ? providers.current[state.activeProvider] : null;

    return registration?.contextValue;
  };

  const getNested = (meta: IModelMetadata, propName: string): Promise<IModelMetadata> => {
    const propMeta = meta.properties.find(p => camelcase(p.path) === propName);

    if (!propMeta)
      return Promise.reject(`property '${propName}' not found`);

    if (propMeta.dataType === DataTypes.entityReference)
      return getMetadata({ modelType: propMeta.entityType });

    if (propMeta.dataType === DataTypes.objectReference)
      return getMetadata({ modelType: propMeta.entityType });

    if (propMeta.dataType === DataTypes.object)
      return Promise.resolve({ type: DataTypes.object, properties: propMeta.properties, specifications: [], apiEndpoints: {}, dataType: DataTypes.object });

    return Promise.reject(`data type '${propMeta.dataType}' doesn't support nested properties`);
  };

  const getContainerProperties = (payload: IGetNestedPropertiesPayload) => {
    return getContainerMetadata(payload).then(m => m.properties);
  };

  const getContainerMetadata = (payload: IGetNestedPropertiesPayload) => {
    const { metadata, containerPath } = payload;
    if (!metadata?.properties)
      return Promise.reject();

    if (containerPath) {
      const parts = containerPath.split('.');

      const promise = parts.reduce((left, right) => {
        return left.then(pp => getNested(pp, right));
      }, Promise.resolve(metadata));

      return promise;
    } else {
      return Promise.resolve(metadata);
    }
  };

  const isEntityType = (modelType: string): Promise<boolean> => {
    if (!modelType)
      return Promise.resolve(false);

    return getMetadata({ modelType: modelType }).then(m => {
      return m.dataType === DataTypes.entityReference;
    });
  };

  const metadataActions: IMetadataDispatcherActionsContext = {
    getMetadata,
    getPropertyMetadata,
    getPropertiesMetadata,
    isEntityType,
    getContainerProperties,
    getContainerMetadata,
    registerProvider,
    activateProvider,
    getActiveProvider,
    /* NEW_ACTION_GOES_HERE */
  };

  return (
    <MetadataDispatcherStateContext.Provider value={state}>
      <MetadataDispatcherActionsContext.Provider value={metadataActions}>
        {children}
      </MetadataDispatcherActionsContext.Provider>
    </MetadataDispatcherStateContext.Provider>
  );
};

function useMetadataDispatcherState(require: boolean) {
  const context = useContext(MetadataDispatcherStateContext);

  if (context === undefined && require) {
    throw new Error('useMetadataDispatcherState must be used within a MetadataDispatcherProvider');
  }

  return context;
}

function useMetadataDispatcherActions(require: boolean) {
  const context = useContext(MetadataDispatcherActionsContext);

  if (context === undefined && require) {
    throw new Error('useMetadataDispatcherActions must be used within a MetadataDispatcherProvider');
  }

  return context;
}

function useMetadataDispatcher(require: boolean = true) {
  const actionsContext = useMetadataDispatcherActions(require);
  const stateContext = useMetadataDispatcherState(require);

  // useContext() returns initial state when provider is missing
  // initial context state is useless especially when require == true
  // so we must return value only when both context are available
  return actionsContext !== undefined && stateContext !== undefined
    ? { ...actionsContext, ...stateContext }
    : undefined;
}

export { MetadataDispatcherProvider, useMetadataDispatcherState, useMetadataDispatcherActions, useMetadataDispatcher };
