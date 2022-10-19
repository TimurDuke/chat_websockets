import React from 'react';
import {Paper, Typography} from "@mui/material";
import PropTypes, {object} from "prop-types";
import {makeStyles} from "tss-react/mui";
import Message from "../Message/Message";
import {deleteMessage} from "../../store/actions/chatActions";
import messagesBg from "../../assests/images/messages-bg.jpg";

const useStyles = makeStyles()(() => ({
    messages: {
        display: 'flex',
        flexDirection: 'column',
        width: '75%',
        overflow: 'auto',
        position: 'relative',
        backgroundImage: `url(${messagesBg})`,
        backgroundSize: 'contain',
    },
    message: {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 15px',
        borderRadius: '8px',
        margin: "8px 10px",
        color: '#fff',
        backgroundColor: '#59596d',
        position: 'relative',
    },
    personalMessage: {
        display: 'flex',
        flexDirection: 'column',
        padding: '15px',
        borderRadius: '8px',
        margin: "8px 10px",
        color: '#fff',
        backgroundColor: '#6b6bef',
        position: 'relative',
    },
    privateMessage: {
        display: 'flex',
        flexDirection: 'column',
        padding: '15px',
        borderRadius: '8px',
        margin: "8px 10px",
        color: '#fff',
        backgroundColor: '#f83838',
        position: 'relative',
    },
}));

const MessagesComponent = ({children, scrollHandler, refMessages, ws, stylesTitle, messages, user}) => {
    const { classes } = useStyles();

    const deleteMessageHandler = id => {
        deleteMessage(ws, {type: "DELETE", id});
    };

    return (
        <Paper
            elevation={3}
            className={classes.messages}
            onScroll={scrollHandler}
            ref={refMessages}
        >
            <Typography
                variant='h6'
                className={stylesTitle}
            >
                Chat
            </Typography>
            {!!messages.length ? messages.map(message => {
                if (message?.recipient?._id === user['_id'] || (message?.recipient && message?.user?._id === user['_id'])) {
                    return <Message
                        key={message['_id']}
                        styles={classes.privateMessage}
                        user={message.user}
                        message={message.message}
                        role={user.role}
                        datetime={message.date}
                        deleteMessageHandler={() => deleteMessageHandler(message['_id'])}
                    />
                } else if (!message?.recipient) {
                    return <Message
                        key={message['_id']}
                        styles={
                            message.user['_id'] === user['_id']
                                ? classes.personalMessage
                                : classes.message
                        }
                        user={message.user}
                        message={message.message}
                        role={user.role}
                        datetime={message.date}
                        deleteMessageHandler={() => deleteMessageHandler(message['_id'])}
                    />
                }
                return null;
            }) : null}
            {children}
        </Paper>
    );
};

MessagesComponent.propTypes = {
    children: PropTypes.node.isRequired,
    messages: PropTypes.arrayOf(object).isRequired,
    user: PropTypes.object.isRequired,
    stylesTitle: PropTypes.string.isRequired,
    scrollHandler: PropTypes.func.isRequired,
    ws: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any })
    ]),
    refMessages: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any })
    ]),
};

export default MessagesComponent;