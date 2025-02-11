import React, { FC, PropsWithChildren, useContext, useEffect } from 'react';
import { FormUpdateMarkupInput, formConfigurationUpdateMarkup } from '../../apis/formConfiguration';
import useThunkReducer from '../../hooks/thunkReducer';
import { useAppConfigurator, useSheshaApplication } from '../../providers';
import { useConfigurationItemsLoader } from '../configurationItemsLoader';
import {
  DEFAULT_FORM_SETTINGS,
  FormIdentifier,
  FormMarkupWithSettings,
  IFormSettings,
  IPersistedFormProps,
} from '../form/models';
import { getFlagSetters } from '../utils/flagsSetters';
import {
  loadErrorAction,
  loadRequestAction,
  loadSuccessAction,
  saveErrorAction,
  saveRequestAction,
  saveSuccessAction,
  updateFormSettingsAction,
} from './actions';
import {
  FORM_PERSISTER_CONTEXT_INITIAL_STATE,
  FormPersisterActionsContext,
  FormPersisterStateConsumer,
  FormPersisterStateContext,
  IFormPersisterActionsContext,
  IFormPersisterStateContext,
  ILoadFormPayload,
} from './contexts';
import formReducer from './reducer';

export interface IFormProviderProps {
  formId: FormIdentifier;
  skipCache?: boolean;
}

const FormPersisterProvider: FC<PropsWithChildren<IFormProviderProps>> = ({ children, formId, skipCache = false }) => {
  const initial: IFormPersisterStateContext = {
    ...FORM_PERSISTER_CONTEXT_INITIAL_STATE,
    formId: formId,
    skipCache: skipCache,
  };

  const [state, dispatch] = useThunkReducer(formReducer, initial);

  const { getForm, clearFormCache } = useConfigurationItemsLoader();
  const { configurationItemMode } = useAppConfigurator();
  const { backendUrl, httpHeaders } = useSheshaApplication();

  const doFetchFormInfo = (payload: ILoadFormPayload) => {
    if (formId) {
      dispatch(loadRequestAction({ formId }));
      getForm({ formId, configurationItemMode: configurationItemMode, skipCache: payload.skipCache })
        .then((form) => {
          const formContent: IPersistedFormProps = {
            id: form.id,
            name: form.name,
            module: form.module,
            label: form.label,
            description: form.description,
            markup: form.markup ?? [],
            formSettings: form.settings ?? DEFAULT_FORM_SETTINGS,
            versionNo: form.versionNo,
            versionStatus: form.versionStatus,
            isLastVersion: form.isLastVersion,
          };

          // parse json content
          dispatch((dispatchThunk, _getState) => {
            dispatchThunk(loadSuccessAction(formContent));
          });
        })
        .catch((e) => {
          dispatch(loadErrorAction(e));
        });
    }
  };

  useEffect(() => {
    if (!formId) return;

    doFetchFormInfo({ skipCache: state.skipCache });
  }, [formId]);

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const loadForm = (payload: ILoadFormPayload) => {
    doFetchFormInfo(payload);
  };

  const saveForm = async (payload: FormMarkupWithSettings): Promise<void> => {
    if (!state.formProps?.id) return Promise.reject();

    dispatch(saveRequestAction());

    const dto: FormUpdateMarkupInput = {
      id: state.formProps.id,
      markup: JSON.stringify(payload),
    };

    await formConfigurationUpdateMarkup(dto, { base: backendUrl, headers: httpHeaders })
      .then((_response) => {
        // clear cache
        clearFormCache({ formId: state.formId });

        dispatch(saveSuccessAction());
        return Promise.resolve();
      })
      .catch((error) => {
        dispatch(saveErrorAction(error));
        return Promise.reject();
      });
  };

  const updateFormSettings = (settings: IFormSettings) => {
    dispatch(updateFormSettingsAction(settings));
  };

  const formPersisterActions: IFormPersisterActionsContext = {
    ...getFlagSetters(dispatch),
    loadForm,
    saveForm,
    updateFormSettings,
    /* NEW_ACTION_GOES_HERE */
  };

  return (
    <FormPersisterStateContext.Provider value={state}>
      <FormPersisterActionsContext.Provider value={formPersisterActions}>
        {children}
      </FormPersisterActionsContext.Provider>
    </FormPersisterStateContext.Provider>
  );
};

function useFormPersisterState(require: boolean = true) {
  const context = useContext(FormPersisterStateContext);

  if (require && context === undefined) {
    throw new Error('useFormPersisterState must be used within a FormPersisterProvider');
  }

  return context;
}

function useFormPersisterActions(require: boolean = true) {
  const context = useContext(FormPersisterActionsContext);

  if (require && context === undefined) {
    throw new Error('useFormPersisterActions must be used within a FormPersisterProvider');
  }

  return context;
}

function useFormPersister(require: boolean = true) {
  const actionsContext = useFormPersisterActions(require);
  const stateContext = useFormPersisterState(require);

  // useContext() returns initial state when provider is missing
  // initial context state is useless especially when require == true
  // so we must return value only when both context are available
  return actionsContext !== undefined && stateContext !== undefined
    ? { ...actionsContext, ...stateContext }
    : undefined;
}

export { FormPersisterStateConsumer as FormPersisterConsumer, FormPersisterProvider, useFormPersister };
