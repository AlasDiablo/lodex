import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const NEW_CHARACTERISTIC_FORM_NAME = 'NEW_CHARACTERISTIC_FORM_NAME';

export const SET_CHARACTERISTIC_VALUE = 'SET_CHARACTERISTIC_VALUE';

export const UPDATE_CHARACTERISTICS = 'UPDATE_CHARACTERISTICS';
export const UPDATE_CHARACTERISTICS_ERROR = 'UPDATE_CHARACTERISTICS_ERROR';
export const UPDATE_CHARACTERISTICS_SUCCESS = 'UPDATE_CHARACTERISTICS_SUCCESS';

export const ADD_CHARACTERISTIC = 'ADD_CHARACTERISTIC';
export const ADD_CHARACTERISTIC_SUCCESS = 'ADD_CHARACTERISTIC_SUCCESS';
export const ADD_CHARACTERISTIC_ERROR = 'ADD_CHARACTERISTIC_ERROR';

export const setCharacteristicValue = createAction(SET_CHARACTERISTIC_VALUE);
export const updateCharacteristics = createAction(UPDATE_CHARACTERISTICS);
export const updateCharacteristicsError = createAction(UPDATE_CHARACTERISTICS_ERROR);
export const updateCharacteristicsSuccess = createAction(UPDATE_CHARACTERISTICS_SUCCESS);

export const addCharacteristic = createAction(ADD_CHARACTERISTIC);
export const addCharacteristicSuccess = createAction(ADD_CHARACTERISTIC_SUCCESS);
export const addCharacteristicError = createAction(ADD_CHARACTERISTIC_ERROR);

export const defaultState = {
    characteristics: [],
    editing: false,
    error: null,
    newCharacteristics: null,
    updating: false,
    isSaving: false,
};

export default handleActions({
    LOAD_PUBLICATION_SUCCESS: (state, { payload: { characteristics } }) => ({
        ...state,
        characteristics,
        newCharacteristics: characteristics[0],
    }),
    SET_CHARACTERISTIC_VALUE: ({ newCharacteristics, ...state }, { payload: { name, value } }) => ({
        ...state,
        newCharacteristics: {
            ...newCharacteristics,
            [name]: value,
        },
    }),
    UPDATE_CHARACTERISTICS: state => ({
        ...state,
        error: null,
        updating: true,
    }),
    UPDATE_CHARACTERISTICS_ERROR: (state, { payload: error }) => ({
        ...state,
        error,
    }),
    UPDATE_CHARACTERISTICS_SUCCESS: (state, { payload: characteristics }) => ({
        ...state,
        characteristics: [
            characteristics,
            ...state.characteristics,
        ],
        newCharacteristics: characteristics,
        editing: false,
        error: null,
        updating: false,
    }),
}, defaultState);

const isCharacteristicEditing = state => state.editing;
const isCharacteristicUpdating = state => state.updating;
const getCharacteristicError = state => state.error;

const getCharacteristicsAsResource = state => state.characteristics[0] || {};
const getNewCharacteristicsAsResource = state => state.newCharacteristics || {};

const getParams = (state, params) => params;

const getCharacteristics = createSelector(
    getCharacteristicsAsResource,
    getParams,
    (characteristics, fields) => fields
            .map(field => ({
                ...field,
                value: characteristics[field.name],
            })),
);

const getNewCharacteristics = createSelector(
    getNewCharacteristicsAsResource,
    getParams,
    (characteristics, fields) => fields
            .map(field => ({
                ...field,
                value: characteristics[field.name],
            })),
);

const getRootCharacteristics = createSelector(
    getCharacteristicsAsResource,
    getParams,
    (characteristics, fields) => fields
            .map(field => ({
                ...field,
                value: characteristics[field.name],
            }))
            .filter(field => !field.completes),
);

const isSaving = state => state.isSaving;

export const fromCharacteristic = {
    getNewCharacteristics,
    isCharacteristicEditing,
    isCharacteristicUpdating,
    getCharacteristicError,
    getCharacteristics,
    getCharacteristicsAsResource,
    getRootCharacteristics,
    isSaving,
};
