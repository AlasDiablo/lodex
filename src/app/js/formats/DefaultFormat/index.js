import React from 'react';

import DefaultView from './DefaultView';
import DefaultEdition from './DefaultEdition';

const Empty = () => <span />;

export default {
    Component: DefaultView,
    ListComponent: DefaultView,
    AdminComponent: Empty,
    EditionComponent: DefaultEdition,
    predicate: value =>
        value == null ||
        value === '' ||
        (!Array.isArray(value) && typeof value !== 'object'),
    defaultArgs: {},
};
