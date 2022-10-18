import React, {useEffect, useRef, useState} from 'react';
import {Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Box} from "@mui/material";
import {makeStyles} from "tss-react/mui";
import {
    acceptMessage,
    acceptPrivateMessage,
    deleteMessage,
    getOnlineUsers,
    getPrevMessages,
    sendMessage,
    sendPrivateMessage
} from "../../store/actions/chatActions";
import usersBg from '../../assests/images/users-bg.jpg';
import messagesBg from '../../assests/images/messages-bg.jpg';
import UsersComponent from "../../components/UsersComponent/UsersComponent";
import MessagesComponent from "../../components/MessagesComponent/MessagesComponent";
import MessageForm from "../../components/UI/Form/MessageForm/MessageForm";

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
            <UsersComponent
                stylesMembers={classes.members}
                stylesTitle={classes.titles}
                stylesUser={classes.user}
                users={users}
            />
            <MessagesComponent
                stylesMessages={classes.messages}
                stylesTitle={classes.titles}
                stylesDefault={classes.message}
                stylesPersonal={classes.personalMessage}
                stylesPrivate={classes.privateMessage}
                deleteHandler={deleteMessageHandler}
                scrollHandler={scrollHandler}
                refMessages={myRef}
                messages={messages}
                user={user}
            >
                <MessageForm
                    stylesForm={classes.form}
                    stylesScroll={classes.downIcon}
                    stylesInput={classes.input}
                    formSubmit={formSubmit}
                    scrollHandler={scrollToBottom}
                    inputHandler={inputChangeHandler}
                    scrollState={downScroll}
                    recipientValue={state.recipient}
                    messageValue={state.message}
                    user={user}
                    users={users}
                />
            </MessagesComponent>
        </Box>
    );
};

export default Messages;