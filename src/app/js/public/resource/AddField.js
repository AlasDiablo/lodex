import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { submit as submitAction } from 'redux-form';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import ButtonWithStatus from '../../lib/ButtonWithStatus';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromResource } from '../selectors';
import AddFieldForm from './AddFieldForm';
import {
    NEW_RESOURCE_FIELD_FORM_NAME,
} from './';

export const AddFieldComponent = ({ handleClose, handleOpen, handleSubmit, saving, show, style, p: polyglot }) => {
    const actions = [
        <ButtonWithStatus
            className="add-field-to-resource"
            label={polyglot.t('add-field')}
            primary
            loading={saving}
            onTouchTap={handleSubmit}
        />,
        <FlatButton label={'Cancel'} onClick={handleClose} />,
    ];

    return (
        <div style={style}>
            <FlatButton
                className={'add-field-resource'}
                label={polyglot.t('add-field')}
                primary
                onClick={handleOpen}
            />

            <Dialog
                title={polyglot.t('add_field_to_resource')}
                actions={actions}
                modal={false}
                open={show}
                onRequestClose={handleClose}
            >
                <AddFieldForm />
            </Dialog>
        </div>
    );
};

AddFieldComponent.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    saving: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    style: PropTypes.object, // eslint-disable-line
};

const mapStateToProps = state => ({
    saving: fromResource.isSaving(state),
});

const mapDispatchToProps = ({
    submit: submitAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withState('show', 'setShow', false),
    withHandlers({
        handleOpen: ({ setShow }) => (event) => {
            event.preventDefault();
            setShow(true);
        },
        handleClose: ({ setShow }) => (event) => {
            event.preventDefault();
            setShow(false);
        },
        handleSubmit: ({ setShow, submit }) => () => {
            submit(NEW_RESOURCE_FIELD_FORM_NAME);
            setShow(false);
        },
    }),
    translate,
)(AddFieldComponent);
