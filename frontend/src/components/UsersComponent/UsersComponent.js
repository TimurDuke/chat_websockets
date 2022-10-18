import React from 'react';
import {Paper, Typography} from "@mui/material";
import User from "../User/User";
import PropTypes, {object} from "prop-types";

const UsersComponent = ({stylesMembers, stylesTitle, users, stylesUser}) => {
    return (
        <Paper elevation={3} className={stylesMembers}>
            <Typography
                variant='h6'
                className={stylesTitle}
            >
                Online users
            </Typography>
            {!!users.length ? users.map(user => (
                <User
                    key={user['_id']}
                    styles={stylesUser}
                    username={user.username}
                />
            )) : null}
        </Paper>
    );
};

UsersComponent.propTypes = {
    users: PropTypes.arrayOf(object).isRequired,
    stylesMembers: PropTypes.string.isRequired,
    stylesTitle: PropTypes.string.isRequired,
    stylesUser: PropTypes.string.isRequired,
};

export default UsersComponent;