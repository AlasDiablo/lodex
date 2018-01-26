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
        const { field, className, resource, formatData } = this.props;
        const size =
            field.format && field.format.args && field.format.args.size
                ? field.format.args.size
                : 1;
        const { colors } = field.format.args || { colors: '' };
        const colorsSet = String(colors)
            .split(/[^\w]/)
            .filter(x => x.length > 0)
            .map(x => String('#').concat(x));
        const value = formatData || resource[field.name];

        return (
            <div className={className}>
                <Bigbold
                    value={commaNumber(value, ' ')}
                    colorsSet={colorsSet}
                    size={size}
                />
            </div>
        );
    }
}

EmphasedNumberView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object,
    formatData: PropTypes.string,
    className: PropTypes.string,
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