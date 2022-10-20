import React, {useEffect, useRef, useState} from 'react';
import {Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Box} from "@mui/material";
import {makeStyles} from "tss-react/mui";
import {
    acceptMessage,
    acceptPrivateMessage,
    errorMessage,
    getOnlineUsers,
    getPrevMessages,
} from "../../store/actions/chatActions";
import UsersComponent from "../../components/UsersComponent/UsersComponent";
import MessagesComponent from "../../components/MessagesComponent/MessagesComponent";
import MessageForm from "../../components/UI/Form/MessageForm/MessageForm";
import {UseToastError} from "../../hooks";

const useStyles = makeStyles()(theme => ({
    box: {
        display: 'flex',
        padding: '20px 0',
        justifyContent: "space-between",
        alignItems: 'center',
        '& > *': {
            height: theme.spacing(83),
        },
    },
    titles: {
        padding: "15px 0",
        textAlign: 'center',
        backgroundColor: '#51a1e6',
        color: '#fff',
        borderRadius: '5px',
        position: 'sticky',
        top: '0',
        opacity: '0.9',
        zIndex: '10'
    },
}));

const Messages = () => {
    const {classes} = useStyles();

    const ws = useRef(null);
    const messagesRef = useRef(null);
    const refresh = useRef(null);

    const dispatch = useDispatch();

    const [downScroll, setDownScroll] = useState(false);

    const user = useSelector(state => state.users.user);

    const users = useSelector(state => state.chat.users);
    const messages = useSelector(state => state.chat.messages);


    const connectToSocket = () => {
        ws.current = new WebSocket("ws://localhost:8000/chat?token=" + user.token);

        ws.current.onopen = () => {
            console.log('Connection established');
            clearInterval(refresh.current);
        };

        ws.current.onmessage = e => {
            const decodedMessage = JSON.parse(e.data);
            switch (decodedMessage.type) {
                case "USERS":
                    return dispatch(getOnlineUsers(decodedMessage['activeUsers']));
                case "PREV_MESSAGES":
                    return dispatch(getPrevMessages(decodedMessage.messages));
                case "BROADCAST":
                    return dispatch(acceptMessage(decodedMessage.message));
                case "PRIVATE":
                    return dispatch(acceptPrivateMessage(decodedMessage.message));
                case "ERROR":
                    UseToastError(decodedMessage.error);
                    return dispatch(errorMessage(decodedMessage.error));

                default:
                    console.log('Unknown message type: ', decodedMessage.type);
            }
        };
    };

    const scrollToBottom = () => {
        messagesRef.current.scrollTo({
            top: messagesRef.current.offsetTop + '1200',
            left: '0',
            behavior: "smooth",
        });
    };

    useEffect(() => {
        if (user) {
            connectToSocket();

            ws.current.onclose = () => {
                refresh.current = setInterval(() => {
                    connectToSocket();
                    console.log('Connect failure');
                }, 5000);
                console.log("ws connection closed");
            };

            return () => {
                ws.current.close();
            };
        }
        //eslint-disable-next-line
    }, [user, dispatch]);

    useEffect(() => {
        if (user) {
            scrollToBottom();
        }
    }, [user, messages]);

    const scrollHandler = e => {
        const scroll = (messagesRef.current.scrollHeight - e.currentTarget.offsetHeight) - e.currentTarget.scrollTop;
        if (scroll > 300) {
            setDownScroll(true);
        } else {
            setDownScroll(false);
        }
    };

    if (!user) {
        return <Redirect to='/login'/>;
    }

    return (
        <Box className={classes.box}>
            <UsersComponent
                stylesTitle={classes.titles}
                users={users}
            />
            <MessagesComponent
                stylesTitle={classes.titles}
                scrollHandler={scrollHandler}
                refMessages={messagesRef}
                ws={ws}
                messages={messages}
                user={user}
            >
                <MessageForm
                    scrollHandler={scrollToBottom}
                    scrollState={downScroll}
                    ws={ws}
                    user={user}
                    users={users}
                />
            </MessagesComponent>
        </Box>
    );
};

export default Messages;