import React from 'react';
import {Paper, Typography} from "@mui/material";
import PropTypes, {object} from "prop-types";
import {makeStyles} from "tss-react/mui";
import User from "../User/User";
import usersBg from "../../assests/images/users-bg.jpg";

const useStyles = makeStyles()(() => ({
    members: {
        width: '20%',
        backgroundImage: `url(${usersBg})`,
        backgroundSize: 'contain',
        borderRadius: '15px'
    },
    user: {
        padding: '8px 15px',
        borderBottom: '1px solid #fff',
        cursor: 'pointer',
        color: '#fff',
        transition: '.3s',
        "&:hover": {
            backgroundColor: '#e8e5e5',
            color: "#000",
            transition: '.3s'
        }
    },
}));

const UsersComponent = ({stylesTitle, users}) => {
    const { classes } = useStyles();

    return (
        <Paper elevation={3} className={classes.members}>
            <Typography
                variant='h6'
                className={stylesTitle}
            >
                Online users
            </Typography>
            {!!users.length ? users.map(user => (
                <User
                    key={user['_id']}
                    styles={classes.user}
                    username={user.username}
                />
            )) : null}
        </Paper>
    );
};

UsersComponent.propTypes = {
    users: PropTypes.arrayOf(object).isRequired,
    stylesTitle: PropTypes.string.isRequired,
};

export default UsersComponent;