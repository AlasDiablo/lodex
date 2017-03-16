import { call, fork, takeEvery, select } from 'redux-saga/effects';

import {
    EXPORT_PUBLISHED_DATASET,
}
from './';
import { fromDataset, fromFacet } from '../selectors';
import getQueryString from '../../lib/getQueryString';

export const open = url => window.open(url);

export function* handleExportPublishedDatasetSuccess({ payload: type }) {
    const facets = yield select(fromFacet.getAppliedFacets);
    const match = yield select(fromDataset.getFilter);
    const sort = yield select(fromDataset.getSort);

    const queryString = yield call(getQueryString, match, facets, sort);

    yield call(open, `/api/export/${type}?${queryString}`);
}

export function* watchExportPublishedDatasetRequest() {
    yield takeEvery(EXPORT_PUBLISHED_DATASET, handleExportPublishedDatasetSuccess);
}

export default function* () {
    yield fork(watchExportPublishedDatasetRequest);
}
