import React, {useState} from 'react';
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PropTypes, {object} from "prop-types";
import SendIcon from "@mui/icons-material/Send";
import {makeStyles} from "tss-react/mui";
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

const MessageForm = ({scrollState, ws, scrollHandler, users, user}) => {
    const { classes } = useStyles();

    const [state, setState] = useState({
        message: '',
        recipient: ''
    });

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