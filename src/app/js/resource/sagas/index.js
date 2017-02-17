import { fork } from 'redux-saga/effects';

import loadResource from './loadResource';
import saveResource from './saveResource';
import hideResource from './hideResource';
import addFieldToResource from './addFieldToResource';

export default function* () {
    yield fork(loadResource);
    yield fork(saveResource);
    yield fork(hideResource);
    yield fork(addFieldToResource);
}