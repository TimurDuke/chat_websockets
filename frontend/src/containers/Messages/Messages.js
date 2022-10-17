import React, {useEffect, useRef, useState} from 'react';
import {Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Box, Paper, Typography} from "@mui/material";
import {makeStyles} from "tss-react/mui";
import SendIcon from '@mui/icons-material/Send';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
    acceptMessage, acceptPrivateMessage,
    deleteMessage,
    getOnlineUsers,
    getPrevMessages,
    sendMessage, sendPrivateMessage
} from "../../store/actions/chatActions";
import FormElement from "../../components/UI/Form/FormElement/FormElement";
import User from "../../components/User/User";
import Message from "../../components/Message/Message";
import usersBg from '../../assests/images/users-bg.jpg';
import messagesBg from '../../assests/images/messages-bg.jpg';
import FormSelect from "../../components/UI/Form/FormSelect/FormSelect";

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
        display: 'flex',
        flexDirection: 'column',
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
        padding: '10px 15px',
        borderRadius: '8px',
        margin: "8px 10px",
        color: '#fff',
        backgroundColor: '#59596d',
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
    privateMessage: {
        display: 'flex',
        flexDirection: 'column',
        padding: '15px',
        borderRadius: '8px',
        margin: "8px 10px",
        color: '#fff',
        backgroundColor: '#f83838'
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
    form: {
        display: 'flex',
        flexGrow: '1',
        alignItems: 'flex-end',
        justifyContent: "flex-end",
        width: '100%',
        height: theme.spacing(83),
        position: 'sticky',
        bottom: '0',
        left: '0',
        right: '0'
    },

    input: {
        "& .MuiOutlinedInput-root": {
            backgroundImage: `url(${messagesBg})`,
            backgroundSize: 'contain',
            paddingRight: '0',
            '& fieldset': {
                borderTopColor: '#fff',
                borderBottomColor: '#ccc',
            },
            '&:hover fieldset': {
                borderTopColor: '#fff',
                borderBottomColor: '#ccc',
            },
        },
        '& label.Mui-focused': {
            color: '#000',
            fontWeight: '700',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: 'yellow',
        },
        marginBottom: '-2px',
        width: '100%',
        color: '#000'
    },
    downIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: '#fff',
        width: '40px',
        height: '40px',
        position: 'absolute',
        top: '-90%',
        right: '20px',
        cursor: 'pointer',
        zIndex: '5',
        "&:hover": {
            backgroundColor: '#eae9e9',
            transition: '.3s',
        },
        "&:active": {
            backgroundColor: '#bcbaba',
        },
        transition: '.3s',
    }
}));

const Messages = () => {
    const {classes} = useStyles();

    const ws = useRef(null);
    const myRef = useRef(null);
    const dispatch = useDispatch();
    const [state, setState] = useState({
        message: '',
        recipient: ''
    });
    const [downScroll, setDownScroll] = useState(false);

    const user = useSelector(state => state.users.user);

    const users = useSelector(state => state.chat.users);
    const messages = useSelector(state => state.chat.messages);

    const scrollToBottom = () => {
        myRef.current.scrollTo({
            top: myRef.current.offsetTop + '1200',
            left: '0',
            behavior: "smooth",
        });
    };

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
                        return dispatch(acceptMessage(decodedMessage.message));
                    case "PRIVATE":
                        return dispatch(acceptPrivateMessage(decodedMessage.message));

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

    useEffect(() => {
        if (user) {
            scrollToBottom();
        }
    }, [user, messages]);

    const inputChangeHandler = e => {
        const {name, value} = e.target;

        setState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formSubmit = e => {
        e.preventDefault();
        if (!!state.message && !state.recipient) {
            sendMessage(ws, {type: "BROADCAST", message: state.message});
            setState(prev => ({
                ...prev,
                message: '',
            }));
        }

        if (!!state.recipient && !!state.message) {
            console.log('123')
            sendPrivateMessage(ws,
                {
                    type: "PRIVATE",
                    message: state.message,
                    recipient: state.recipient,
                    sender: user['_id'],
                });
            setState({
                message: '',
                recipient: '',
            });
        }
    };

    const deleteMessageHandler = id => {
        deleteMessage(ws, {type: "DELETE", id});
    };

    const scrollHandler = e => {
        const scroll = (myRef.current.scrollHeight - e.currentTarget.offsetHeight) - e.currentTarget.scrollTop;
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
            <Paper
                elevation={3}
                className={classes.messages}
                onScroll={scrollHandler}
                ref={myRef}
            >
                <Typography
                    variant='h6'
                    className={classes.titles}
                >
                    Chat
                </Typography>
                {!!messages.length ? messages.map(message => {
                    if (message?.recipient === user['_id']) {
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
                <form className={classes.form}
                      onSubmit={formSubmit}
                >
                    {downScroll ? <div
                        className={classes.downIcon}
                        onClick={() => scrollToBottom()}
                    >
                        <ArrowDownwardIcon color='primary'/>
                    </div> : null}
                    <FormElement
                        label="Write a message..."
                        name="message"
                        value={state.message}
                        onChange={inputChangeHandler}
                        autoComplete="message"
                        autoFocus
                        required={true}
                        styles={classes.input}
                        icon={!!state.message ? <SendIcon color='primary'/> : null}
                        select={
                            <FormSelect
                                onChange={inputChangeHandler}
                                user={user}
                                name='recipient'
                                options={users}
                                label='Users'
                                value={state.recipient}
                            />
                        }
                    />
                </form>
            </Paper>
        </Box>
    );
};

export default Messages;