import React from 'react';
import {Paper, Typography} from "@mui/material";
import Message from "../Message/Message";
import PropTypes, {object} from "prop-types";

const MessagesComponent = (
    {
        children,
        stylesMessages,
        scrollHandler,
        refMessages,
        stylesTitle,
        messages,
        user,
        stylesPrivate,
        stylesPersonal,
        stylesDefault,
        deleteHandler
    }
) => {
    return (
        <Paper
            elevation={3}
            className={stylesMessages}
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
                if (message?.recipient === user['_id']) {
                    return <Message
                        key={message['_id']}
                        styles={stylesPrivate}
                        user={message.user}
                        message={message.message}
                        role={user.role}
                        datetime={message.date}
                        deleteMessageHandler={() => deleteHandler(message['_id'])}
                    />
                } else if (!message?.recipient) {
                    return <Message
                        key={message['_id']}
                        styles={
                            message.user['_id'] === user['_id']
                                ? stylesPersonal
                                : stylesDefault
                        }
                        user={message.user}
                        message={message.message}
                        role={user.role}
                        datetime={message.date}
                        deleteMessageHandler={() => deleteHandler(message['_id'])}
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
    stylesMessages: PropTypes.string.isRequired,
    stylesTitle: PropTypes.string.isRequired,
    stylesPrivate: PropTypes.string.isRequired,
    stylesPersonal: PropTypes.string.isRequired,
    stylesDefault: PropTypes.string.isRequired,
    scrollHandler: PropTypes.func.isRequired,
    deleteHandler: PropTypes.func.isRequired,
    refMessages: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any })
    ]),
};

export default MessagesComponent;