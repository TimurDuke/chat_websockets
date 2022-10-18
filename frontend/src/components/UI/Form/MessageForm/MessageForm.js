import React from 'react';
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FormElement from "../FormElement/FormElement";
import SendIcon from "@mui/icons-material/Send";
import FormSelect from "../FormSelect/FormSelect";
import PropTypes, {object} from "prop-types";

const MessageForm = (
    {
        stylesForm,
        stylesScroll,
        stylesInput,
        scrollState,
        formSubmit,
        scrollHandler,
        inputHandler,
        messageValue,
        recipientValue,
        users,
        user,
    }
) => {
    return (
        <form className={stylesForm}
              onSubmit={formSubmit}
        >
            {scrollState ? <div
                className={stylesScroll}
                onClick={scrollHandler}
            >
                <ArrowDownwardIcon color='primary'/>
            </div> : null}
            <FormElement
                label="Write a message..."
                name="message"
                value={messageValue}
                onChange={inputHandler}
                autoComplete="message"
                autoFocus
                required={true}
                styles={stylesInput}
                icon={!!messageValue ? <SendIcon color='primary'/> : null}
                select={
                    <FormSelect
                        onChange={inputHandler}
                        user={user}
                        name='recipient'
                        options={users}
                        label='Users'
                        value={recipientValue}
                    />
                }
            />
        </form>
    );
};

MessageForm.propTypes = {
    users: PropTypes.arrayOf(object).isRequired,
    user: PropTypes.object.isRequired,
    stylesForm: PropTypes.string.isRequired,
    stylesScroll: PropTypes.string.isRequired,
    stylesInput: PropTypes.string.isRequired,
    messageValue: PropTypes.string.isRequired,
    recipientValue: PropTypes.string.isRequired,
    scrollHandler: PropTypes.func.isRequired,
    inputHandler: PropTypes.func.isRequired,
    formSubmit: PropTypes.func.isRequired,
    scrollState: PropTypes.bool.isRequired,
};

export default MessageForm;