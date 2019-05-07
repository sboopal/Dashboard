/* eslint-disable*/
import React, { Component } from 'react';

class MessageModal extends Component {
    render() {
        const { message } = this.props;
        return(
            <div id="mymodal" className="modal">
                <div className="modal-content">
                    <h4>{message.header}</h4>
                    <p>{message.content}</p>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
            </div>
        );
    }
}

export default MessageModal;