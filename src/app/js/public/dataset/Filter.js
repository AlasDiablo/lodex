import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';
import { ToolbarGroup } from 'material-ui/Toolbar';
import ActionSearch from 'material-ui/svg-icons/action/search';
import CircularProgress from 'material-ui/CircularProgress';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { applyFilter as applyFilterAction } from './';
import { fromDataset, fromPublication } from '../selectors';

export const FilterComponent = ({ handleFilterChange, hasSearchableFields, isDatasetLoading, p: polyglot }) => (
    hasSearchableFields
    ? (
        <ToolbarGroup>
            {isDatasetLoading
                ? <CircularProgress className="dataset-loading" size={20} /> :
                <ActionSearch />
            }
            <TextField
                className="filter"
                hintText={polyglot.t('filter')}
                onChange={(_, e) => handleFilterChange(e)}
            />
        </ToolbarGroup>
    )
    : null);

FilterComponent.propTypes = {
    handleFilterChange: PropTypes.func.isRequired,
    hasSearchableFields: PropTypes.bool.isRequired,
    isDatasetLoading: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    isDatasetLoading: fromDataset.isDatasetLoading(state),
    hasSearchableFields: fromPublication.hasSearchableFields(state),
});

const mapDispatchToProps = ({
    applyFilter: applyFilterAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        handleFilterChange: ({ applyFilter }) => (match) => {
            applyFilter(match);
        },
    }),
    translate,
)(FilterComponent);