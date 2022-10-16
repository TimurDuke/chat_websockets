import React from 'react';
import {Button} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from "prop-types";

const Message = ({role, styles, username, message, deleteMessageHandler}) => {
    return (
        <div className={styles}>
            <div>
                <b>{username}</b>
                {role === 'moderator' ?
                    <Button
                        onClick={deleteMessageHandler}
                        startIcon={<DeleteIcon color='error'/>}
                    /> : null}
            </div>
            {message}
        </div>
    );
};

Message.propTypes = {
    username: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    deleteMessageHandler: PropTypes.func,
    styles: PropTypes.string,
};

export default Message;