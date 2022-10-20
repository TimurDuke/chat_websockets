import React, {useState} from 'react';
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PropTypes, {object} from "prop-types";
import SendIcon from "@mui/icons-material/Send";
import {makeStyles} from "tss-react/mui";
import MoodIcon from '@mui/icons-material/Mood';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import FormElement from "../FormElement/FormElement";
import FormSelect from "../FormSelect/FormSelect";
import {sendMessage, sendPrivateMessage} from "../../../../store/actions/chatActions";
import messagesBg from "../../../../assests/images/messages-bg.jpg";

const useStyles = makeStyles()(theme => ({
    form: {
        display: 'flex',
        flexGrow: '1',
        alignItems: 'flex-end',
        justifyContent: "flex-end",
        width: '100%',
        height: theme.spacing(83),
        padding: '0 10px',
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
                borderBottomColor: '#fff',
            },
            '&:hover fieldset': {
                borderTopColor: '#fff',
                borderBottomColor: '#fff',
            },
            '&.Mui-focused fieldset': {
                borderTopColor: '#fff',
                borderBottomColor: '#fff',
            },
        },
        '& label.Mui-focused': {
            color: '#000',
            fontWeight: '700',
        },
        width: '100%',
        color: '#000',
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
    },
    emojiBlock: {
        width: "5%",
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${messagesBg})`,
        backgroundSize: 'contain',
        borderRadius: '10px',
        "@media (max-width: 1150px)": {
            width: "10%"
        },
        "@media (max-width: 730px)": {
            width: "15%"
        }
    },
    emojiIcon: {
        width: '70%',
        height: '70%',
        color: '#59596d',
        cursor: 'pointer',
        "&:hover": {
            color: "#3b3b48",
        }
    },
    emojies: {
        position: 'absolute',
        bottom: '50px',
        right: '0',
        padding: '10px 10px 20px 10px',
    }
}));

const MessageForm = ({scrollState, ws, scrollHandler, users, user}) => {
    const { classes } = useStyles();

    const [state, setState] = useState({
        message: '',
        recipient: ''
    });

    const [showEmojies, setShowEmojies] = useState(false);

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
            sendMessage(ws, {type: "BROADCAST", message: state.message.trim()});
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

    const emojiHandler = e => {
        setState(prev => ({
            ...prev,
            message: state.message + e.native
        }));
    };

    return (
        <form className={classes.form}
              onSubmit={formSubmit}
        >
            {scrollState ? <div
                className={classes.downIcon}
                onClick={scrollHandler}
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
                focus={true}
                styles={classes.input}
                icon={!!state.message && !!state.message.trim().length ? <SendIcon color='primary'/> : null}
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
            <div
                className={classes.emojies}
                onMouseOver={() => setShowEmojies(true)}
                onMouseLeave={() => setShowEmojies(false)}
                style={{display: showEmojies ? 'block' : 'none'}}
            >
                <Picker
                    data={data}
                    onEmojiSelect={emojiHandler}
                />
            </div>
            <div
                className={classes.emojiBlock}
                onMouseOver={() => setShowEmojies(true)}
                onMouseLeave={() => setShowEmojies(false)}
            >
                <MoodIcon className={classes.emojiIcon}/>
            </div>
        </form>
    );
};

MessageForm.propTypes = {
    users: PropTypes.arrayOf(object).isRequired,
    user: PropTypes.object.isRequired,
    scrollHandler: PropTypes.func.isRequired,
    scrollState: PropTypes.bool.isRequired,
    ws: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({current: PropTypes.any})
    ]),
};

export default MessageForm;