import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import commaNumber from 'comma-number';
import compose from 'recompose/compose';

import { field as fieldPropTypes } from '../../propTypes';
import Bigbold from './Bigbold';
import injectData from '../injectData';

class EmphasedNumberView extends Component {
    render() {
        const {
            field,
            className,
            resource,
            formatData,
            size,
            colors,
        } = this.props;
        const value = formatData || resource[field.name];

        return (
            <div className={className}>
                <Bigbold
                    value={commaNumber(value, ' ')}
                    colors={colors}
                    size={size}
                />
            </div>
        );
    }
}

EmphasedNumberView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object,
    formatData: PropTypes.number,
    className: PropTypes.string,
    size: PropTypes.number.isRequired,
    colors: PropTypes.string.isRequired,
};

EmphasedNumberView.defaultProps = {
    className: null,
};

export default compose(
    translate,
    injectData(({ field, resource }) => {
        const value = resource[field.name];
        return isNaN(value) ? value : null;
    }),
)(EmphasedNumberView);
