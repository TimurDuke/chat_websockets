import React, {useEffect, useRef, useState} from 'react';
import {Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Box, Paper, Typography} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import {makeStyles} from "tss-react/mui";
import {getOnlineUsers, getPrevMessages, postMessage, sendMessage} from "../../store/actions/chatActions";
import FormElement from "../../components/UI/Form/FormElement/FormElement";
import User from "../../components/User/User";
import Message from "../../components/Message/Message";
import usersBg from '../../assests/images/users-bg.jpg';
import messagesBg from '../../assests/images/messages-bg.jpg';

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
    members: {
        width: '20%',
        backgroundImage: `url(${usersBg})`,
        backgroundSize: 'contain',
        borderRadius: '15px'
    },
    messages: {
        width: '75%',
        overflow: 'auto',
        position: 'relative',
        backgroundImage: `url(${messagesBg})`,
        backgroundSize: 'contain',
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
    message: {
        display: 'flex',
        flexDirection: 'column',
        padding: '15px',
        borderRadius: '8px',
        margin: "8px 10px",
        color: '#fff',
        backgroundColor: '#59596d'
    },
    personalMessage: {
        display: 'flex',
        flexDirection: 'column',
        padding: '15px',
        borderRadius: '8px',
        margin: "8px 10px",
        color: '#fff',
        backgroundColor: '#6b6bef'
    },
    titles: {
        padding: "15px 0",
        textAlign: 'center',
        backgroundColor: '#51a1e6',
        color: '#fff',
        borderRadius: '5px',
        position: 'sticky',
        top: '0',
        opacity: '0.9'
    },
    form: {
        width: '100%',
        position: 'sticky',
        bottom: '0',
    },
    input: {
        "& .MuiOutlinedInput-root": {
            backgroundImage: `url(${messagesBg})`,
            backgroundSize: 'contain',
        },
        width: '100%',
        color: '#000'
    },
}));

const Messages = () => {
    const {classes} = useStyles();

    const ws = useRef(null);
    const myRef = useRef(null);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');

    const user = useSelector(state => state.users.user);

    const users = useSelector(state => state.chat.users);
    const messages = useSelector(state => state.chat.messages);

    useEffect(() => {
        myRef.current.scrollTo({
            top: myRef.current.offsetTop +  '1200',
            left: '0',
            behavior: "smooth",
        });
    }, [messages]);

    useEffect(() => {
        if (user) {
            ws.current = new WebSocket("ws://localhost:8000/chat?token=" + user.token);
            let refresh;

            ws.current.onopen = () => {
                console.log('Connection established');
                clearInterval(refresh);
            };

            ws.current.onmessage = e => {
                const decodedMessage = JSON.parse(e.data);
                switch (decodedMessage.type) {
                    case "USERS":
                        return dispatch(getOnlineUsers(decodedMessage['activeUsers']));
                    case "PREV_MESSAGES":
                        return dispatch(getPrevMessages(decodedMessage.messages));
                    case "BROADCAST":
                        return dispatch(postMessage(decodedMessage.message));

                    default:
                        console.log('Unknown message type: ', decodedMessage.type);
                }
            };

            ws.current.onclose = () => {
                refresh = setInterval(() => {
                    ws.current = new WebSocket("ws://localhost:8000/chat?token=" + user.token);
                    console.log('Connect failure');
                }, 5000);
                console.log("ws connection closed");
            };

            return () => {
                ws.current.close();
            };
        }
    }, [user, dispatch]);

    const formSubmit = e => {
        e.preventDefault();
        if (!!message) {
            sendMessage(ws, {type: "BROADCAST", message});
            setMessage('');
        }
    };

    const deleteMessageHandler = id => {

    };

    if (!user) {
        return <Redirect to='/login'/>;
    }

    return (
        <Box className={classes.box}>
            <Paper elevation={3} className={classes.members}>
                <Typography
                    variant='h6'
                    className={classes.titles}
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
            <Paper elevation={3} className={classes.messages} ref={myRef}>
                <Typography
                    variant='h6'
                    className={classes.titles}
                >
                    Chat
                </Typography>
                {!!messages.length ? messages.map(message => (
                    <Message
                        key={message['_id']}
                        styles={
                            message.user['_id'] === user['_id'] ?
                                classes.personalMessage :
                                classes.message
                        }
                        username={message.user.username}
                        message={message.message}
                        role={user.role}
                        deleteMessageHandler={() => deleteMessageHandler(message['_id'])}
                    />
                )) : null}
                <form className={classes.form}
                      onSubmit={formSubmit}
                >
                    <FormElement
                        label="Write a message..."
                        name="message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        autoComplete="message"
                        autoFocus
                        required={true}
                        styles={classes.input}
                        icon={!!message ? <SendIcon color='primary'/> : null}
                    />
                </form>
            </Paper>
        </Box>
    );
};

export default Messages;