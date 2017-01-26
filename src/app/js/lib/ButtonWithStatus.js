import React, { PropTypes } from 'react';
import { lightGreenA400, red400 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

import Warning from 'material-ui/svg-icons/alert/warning';
import Success from 'material-ui/svg-icons/action/done';

const getIcon = (error, loading, success) => {
    if (loading) return <CircularProgress size={20} />;
    if (error) return <Warning color={red400} />;
    if (success) return <Success color={lightGreenA400} />;
    return null;
};

const ButtonWithStatus = ({ error, loading, success, ...props }) => (
    <FlatButton
        disabled={loading}
        icon={getIcon(error, loading, success)}
        labelPosition="before"
        {...props}
    />
);

ButtonWithStatus.propTypes = {
    error: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool,
};

export default ButtonWithStatus;
