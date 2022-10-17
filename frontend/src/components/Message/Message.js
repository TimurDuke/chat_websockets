import React from 'react';
import {Button} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from "prop-types";

const Message = ({role, styles, user, message, datetime, deleteMessageHandler}) => {
    return (
        <div className={styles} style={{position: 'relative'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <b>
                    {user.username}
                    {
                        user.role === 'moderator'
                            ? <span style={{color: '#ff2424', opacity: '0.9', marginLeft: '10px'}}> Moderator</span>
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
            <div style={{wordWrap: 'break-word', maxWidth: '65%'}}>
                {message}
            </div>
            <span style={{color: '#ccc', fontSize: '14px', position: 'absolute', right: '3%', bottom: '10px'}}>
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