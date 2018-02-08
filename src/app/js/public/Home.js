import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { push } from 'react-router-redux';
import { Helmet } from 'react-helmet';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { preLoadPublication as preLoadPublicationAction } from '../fields';
import { fromFields, fromCharacteristic } from '../sharedSelectors';

import Alert from '../lib/components/Alert';
import Card from '../lib/components/Card';
import Loading from '../lib/components/Loading';
import DatasetCharacteristics from '../characteristic/DatasetCharacteristics';
import NoDataset from './NoDataset';
import Version from './Version';
import { preLoadDatasetPage } from './dataset';
import { preLoadExporters } from './export';

export class HomeComponent extends Component {
    static defaultProps = {
        error: null,
        sharingTitle: null,
    };

    static propTypes = {
        error: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        preLoadPublication: PropTypes.func.isRequired,
        preLoadDatasetPage: PropTypes.func.isRequired,
        preLoadExporters: PropTypes.func.isRequired,
        hasPublishedDataset: PropTypes.bool.isRequired,
        navigateTo: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
        sharingTitle: PropTypes.string,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    };

    componentWillMount() {
        this.props.preLoadPublication();
        this.props.preLoadDatasetPage();
        this.props.preLoadExporters();
    }

    render() {
        const {
            error,
            hasPublishedDataset,
            loading,
            p: polyglot,
            title,
            description,
        } = this.props;

        if (loading) {
            return <Loading>{polyglot.t('loading')}</Loading>;
        }

        if (error) {
            return (
                <Card>
                    <Alert>{error}</Alert>
                </Card>
            );
        }

        if (hasPublishedDataset) {
            return (
                <div>
                    <Helmet>
                        <title>{title}</title>
                        <meta name="description" content={description} />
                    </Helmet>
                    <div className="header-dataset-section">
                        <DatasetCharacteristics />
                        <Version />
                    </div>
                </div>
            );
        }

        return <NoDataset />;
    }
}

const mapStateToProps = state => {
    const characteristics = fromCharacteristic.getCharacteristicsAsResource(
        state,
    );
    const datasetTitleKey = fromFields.getDatasetTitleFieldName(state);
    const datasetDescriptionKey = fromFields.getDatasetDescriptionFieldName(
        state,
    );
    const title =
        (datasetTitleKey && characteristics[datasetTitleKey]) || 'Unknown';
    const description =
        (datasetDescriptionKey && characteristics[datasetDescriptionKey]) ||
        'n/a';

    return {
        error: fromFields.getError(state),
        loading: fromFields.isLoading(state),
        hasPublishedDataset: fromFields.hasPublishedDataset(state),
        title,
        description,
    };
};

const mapDispatchToProps = {
    preLoadPublication: preLoadPublicationAction,
    preLoadDatasetPage,
    preLoadExporters,
    navigateTo: push,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    HomeComponent,
);
