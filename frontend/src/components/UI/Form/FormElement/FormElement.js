import React from 'react';
import PropTypes from 'prop-types';
import {Button, Grid, InputAdornment, TextField} from "@mui/material";

const FormElement = ({name, value, onChange, label, error, type, required, styles, icon, select}) => {
    return (
        <Grid item xs={12} sx={{width: '100%'}}>
            <TextField
                className={styles}
                type={type}
                required={required}
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                error={Boolean(error)}
                helperText={error}
                autoComplete={name}
                InputProps={styles ?
                    {
                        className: styles,
                        endAdornment: (
                            <InputAdornment
                                position="end"
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <Button
                                    type='submit'
                                    endIcon={icon}
                                />
                                {select}
                            </InputAdornment>
                        )
                    } : null
                }
            />
        </Grid>
    );
};

FormElement.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    type: PropTypes.string,
    required: PropTypes.bool,
    styles: PropTypes.string,
    icon: PropTypes.object,
    select: PropTypes.object,
};

export default FormElement;