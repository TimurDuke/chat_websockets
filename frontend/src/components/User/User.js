import React from 'react';
import PropTypes from "prop-types";

const User = ({username, styles}) => {
    return (
        <div className={styles}>
            <b>{username}</b>
        </div>
    );
};

User.propTypes = {
    username: PropTypes.string.isRequired,
    styles: PropTypes.string,
};

export default User;