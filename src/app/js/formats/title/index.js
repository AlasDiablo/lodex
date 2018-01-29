import Component from './TitleView';
import AdminComponent, { defaultArgs } from './TitleAdmin';
import DefaultFormat from '../DefaultFormat';

export default {
    ...DefaultFormat,
    Component,
    ListComponent: Component,
    AdminComponent,
    defaultArgs,
};
