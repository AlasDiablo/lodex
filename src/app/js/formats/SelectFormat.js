import React, { PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

const SelectFormat = ({ formats, value, onChange }) => (
    <SelectField
        floatingLabelText="Select a format"
        onChange={(event, index, newValue) => onChange(newValue)}
        value={value}
    >
        <MenuItem value="None" primaryText="None" />

        {formats.map(f =>
            <MenuItem value={f} primaryText={f} />,
        )}
    </SelectField>
);

SelectFormat.propTypes = {
    formats: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default SelectFormat;
