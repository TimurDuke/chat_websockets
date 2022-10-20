import React from 'react';
import PropTypes from "prop-types";
import {FormControl, FormHelperText, Grid, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const FormSelect = ({label, name, value, onChange, options, error, required, user}) => {
    return (
        <Grid item sx={{width: '50%', marginBottom: '-3px'}}>
            <FormControl fullWidth error={Boolean(error)}>
                <InputLabel id={`${name}-label`}>{label}</InputLabel>
                <Select
                    required={required}
                    labelId={`${name}-label`}
                    fullWidth
                    label={label}
                    name={name}
                    value={value}
                    onChange={onChange}
                >
                    {options.map(option => {
                        if (user['_id'] !== option['_id']) {
                            return <MenuItem key={option['_id']} value={option['_id']}>
                                {option.username}
                            </MenuItem>
                        } else {
                            return null;
                        }
                    })}
                </Select>
                <FormHelperText>{error}</FormHelperText>
            </FormControl>
        </Grid>
    );
};

FormSelect.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    error: PropTypes.string,
    required: PropTypes.bool,
};

export default FormSelect;