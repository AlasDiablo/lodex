import React, { Component, PropTypes } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { grey400 } from 'material-ui/styles/colors';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';
import { getParsedExcerptColumns, clearParsing } from './';
import ParsingExcerpt from './ParsingExcerpt';
import ParsingSummary from './ParsingSummary';

const styles = {
    list: {
        borderRight: `solid 1px ${grey400}`,
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        paddingRight: '1rem',
    },
    listItem: {
        whiteSpace: 'nowrap',
    },
    parsingContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    parsingRightSection: {
        flexGrow: 2,
    },
};

export class ParsingResultComponent extends Component {
    constructor() {
        super();
        this.state = {
            showErrors: false,
        };
    }

    handleShowExcerpt = () => {
        this.setState({ showErrors: false });
    }

    render() {
        const {
            excerptColumns,
            excerptLines,
            totalLoadedLines,
            totalFailedLines,
            totalParsedLines,
            onClearParsing,
            p: polyglot,
        } = this.props;
        const { showErrors } = this.state;

        return (
            <Card initiallyExpanded>
                <CardHeader
                    actAsExpander
                    showExpandableButton
                    title={polyglot.t('Parsing summary')}
                />
                <CardText style={styles.parsingContainer} expandable initiallyExpanded>
                    <ParsingSummary
                        onShowExcerpt={this.handleShowExcerpt}
                        showErrors={showErrors}
                        totalFailedLines={totalFailedLines}
                        totalLoadedLines={totalLoadedLines}
                        totalParsedLines={totalParsedLines}
                    />
                    <div style={styles.parsingRightSection}>
                        {!showErrors &&
                            <ParsingExcerpt
                                columns={excerptColumns}
                                lines={excerptLines}
                            />
                        }
                    </div>
                </CardText>
                <CardActions>
                    <FlatButton onClick={onClearParsing} label={polyglot.t('Upload another file')} />
                </CardActions>
            </Card>
        );
    }
}

ParsingResultComponent.propTypes = {
    excerptColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    excerptLines: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    totalLoadedLines: PropTypes.number.isRequired,
    totalFailedLines: PropTypes.number.isRequired,
    totalParsedLines: PropTypes.number.isRequired,
    onClearParsing: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    excerptColumns: getParsedExcerptColumns(state),
    excerptLines: state.parsing.excerptLines,
    failedLines: state.parsing.errors,
    loadingParsingResult: state.parsing.loading,
    totalLoadedLines: state.parsing.totalLoadedLines,
    totalFailedLines: state.parsing.totalFailedLines,
    totalParsedLines: state.parsing.totalParsedLines,
});

const mapDispatchToProps = {
    onClearParsing: clearParsing,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ParsingResultComponent);