import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import SparqlRequest from '../SparqlRequest';
import { isURL } from '../../../../../common/uris.js';
import { field as fieldPropTypes } from '../../../propTypes';
import URL from 'url';
import topairs from 'lodash.topairs';
import clonedeep from 'lodash.clonedeep';
import toSentenceCase from 'js-sentencecase';
import ifIsImage from 'if-is-image';

const styles = {
    container2: {
        paddingLeft: '2rem',
        marginBottom: '10px',
        marginRight: '1em',
        marginLeft: '2rem',
        borderLeft: '1px dotted',
        borderColor: '#9e9ea6',
    },
    label: {
        color: 'rgb(158, 158, 158)',
        flexGrow: '2',
        fontSize: '1.5rem',
        textDecoration: 'none',
    },
    id: {
        display: 'inline-block',
    },
    value: {
        display: 'inline-block',
    },
    lang: {
        display: 'inline-block',
        marginRight: '1rem',
        fontSize: '0.6em',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        color: 'grey',
        textTransform: 'uppercase',
        visibility: 'visible',
    },
    show: {
        display: 'inline-block',
        color: 'rgb(158, 158, 158)',
        flexGrow: '2',
        fontWeight: 'bold',
        fontSize: '2rem',
        textDecoration: 'none',
        cursor: 'pointer',
    },
    value_min: {
        display: 'inline-block',
        color: 'rgb(158, 158, 158)',
        fontSize: '1.3rem',
    },
    array: {
        flexGrow: '2',
        fontSize: '1.5rem',
        textDecoration: 'none',
        margin: 0,
    },
    imgDefault: {
        'max-width': '900px',
    },
};

export class SparqlTextField extends Component {
    ifArray = result => {
        const { className, sparql } = this.props;
        const temp = clonedeep(result);
        if (temp[1].value.includes(sparql.separator)) {
            temp[1].value = temp[1].value.split(sparql.separator);
            return (
                <ul
                    className={('value_sparql_array', className)}
                    style={styles.array}
                >
                    {temp[1].value.map((data, key) => {
                        temp[1].value = data;
                        return <li key={key}>{this.showURL(temp)}</li>;
                    })}
                </ul>
            );
        } else {
            return (
                <div className="value_sparql" style={styles.value}>
                    {this.showURL(temp)} &#160;
                </div>
            );
        }
    };

    checkImage = src => {
        if (ifIsImage(src)) {
            return <img src={src} style={styles.imgDefault} />;
        } else {
            return <a href={src}>{src}</a>;
        }
    };

    showURL = result => {
        if (isURL(result[1].value) && result[1].type == 'uri') {
            return this.checkImage(result[1].value);
        } else {
            return <span>{result[1].value}</span>;
        }
    };

    getLang = result => {
        if (result[1]['xml:lang'] != undefined) {
            return <span>{result[1]['xml:lang']}</span>;
        } else {
            return null;
        }
    };

    render() {
        const { className, formatData } = this.props;
        if (formatData != undefined) {
            return (
                <div className={className}>
                    {formatData.results.bindings.map((result, key) => {
                        return (
                            <div key={key} style={styles.container2}>
                                {topairs(result).map((obj, index) => {
                                    return (
                                        <div key={index}>
                                            <div style={styles.id}>
                                                <span
                                                    className="label_sparql"
                                                    style={styles.label}
                                                >
                                                    {toSentenceCase(obj[0])}
                                                    &#160; : &#160;
                                                </span>
                                            </div>
                                            {this.ifArray(obj)}
                                            <div
                                                className="lang_sparql property_language"
                                                style={styles.lang}
                                            >
                                                {this.getLang(obj)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return <span> </span>;
        }
    }
}

SparqlTextField.propTypes = {
    className: PropTypes.string,
    formatData: PropTypes.object,
    sparql: PropTypes.object,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

SparqlTextField.defaultProps = {
    className: null,
};

export default compose(
    translate,
    SparqlRequest(({ field, resource, sparql }) => {
        const value = resource[field.name];
        if (!value) {
            return null;
        }
        let builtURL = sparql.endpoint;
        if (!isURL(builtURL)) {
            builtURL = 'https://' + builtURL;
        }

        if (!builtURL.endsWith('?query=')) {
            builtURL += '?query=';
        }

        builtURL += encodeURIComponent(
            sparql.request
                .trim()
                .replace(/[\s\u200B]+/g, ' ')
                .replace(/[?]{2}/g, value.trim()),
        );
        builtURL = builtURL.replace(/LIMIT([%]20)+\d*/i, ''); //remove LIMIT with its var
        const request = builtURL + '%20LIMIT%20' + sparql.maxValue;
        if (isURL(request)) {
            const source = URL.parse(request);

            return URL.format(source);
        }
        return null;
    }),
)(SparqlTextField);