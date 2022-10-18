import React from 'react';
import {Button} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from "prop-types";
import './Message.css';

const Message = ({role, styles, user, message, datetime, deleteMessageHandler}) => {
    return (
        <div className={styles}>
            <div className='message-block'>
                <b>
                    {user.username}
                    {
                        user.role === 'moderator'
                            ? <span className='moderator-span'> Moderator</span>
                            : null
                    }
                </b>
                {role === 'moderator' ?
                    <Button
                        onClick={deleteMessageHandler}
                        size='large'
                        endIcon={<DeleteIcon color='error'/>}
                    /> : null}
            </div>
            <div className='message-inner'>
                {message}
            </div>
            <span className='message-date'>
                {new Date(datetime).toLocaleString()}
            </span>
        </div>
    );
};

Message.propTypes = {
    user: PropTypes.object.isRequired,
    message: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    styles: PropTypes.string.isRequired,
    datetime: PropTypes.string.isRequired,
    deleteMessageHandler: PropTypes.func.isRequired,
};

export default Message;