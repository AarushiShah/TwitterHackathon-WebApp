import React, { Component } from "react";
import PropTypes from "prop-types";
import "./ChatBubble.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

class ChatBubble extends Component {
  state = {
    newMessage: "",
    transcript: useSpeechRecognition()
  };
  constructor(props) {
    super(props)
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null
    }
  }
  getConversations(messages) {
    if (messages == undefined) {
      return;
    }

    const listItems = messages.map((message, index) => {
      let bubbleClass = "me";
      let bubbleDirection = "";

      if (message.type === 0) {
        bubbleClass = "you";
        bubbleDirection = "bubble-direction-reverse";
      }
      return (
        <div className={`bubble-container ${bubbleDirection}`} key={index}>
          <img className={`img-circle`} src={message.image} />
          <div className={`bubble ${bubbleClass}`}>{message.text}</div>
        </div>
      );
    });
    return listItems;
  }

  handleSubmit = e => {
    e.preventDefault();

    const {
      props: { onNewMessage },
      state: { newMessage }
    } = this;

    if (onNewMessage && newMessage) {
      onNewMessage(newMessage);
    }

    this.setState({
      newMessage: ""
    });
  };

  handleInputChange = e =>
    this.setState({
      newMessage: e.target.value
    });

  render() {
    const {
      props: { messages },
      state: { newMessage }
    } = this;
    const chatList = this.getConversations(messages);

    return (
      <div className="chats">
        <div className="chat-list">{chatList}</div>
        <form className="new-message" onSubmit={this.handleSubmit}>
          <input
            value={this.state.transcript}
            placeholder="Write a new message"
            onChange={this.handleInputChange}
            className="new-message-input"
          />
        </form>
        <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={this.setState({transcript: ""})}>Reset</button>
      </div>
    );
  }
}

ChatBubble.propTypes = {
  messages: PropTypes.array.isRequired,
  onNewMessage: PropTypes.func.isRequired
};

export default ChatBubble;
