import React, { Component } from "react";
import ReactDOM from 'react-dom';
import './App.css';

import Message from './Message.js';

class Chatroom extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: []
        };

        this.submitMessage = this.submitMessage.bind(this);
    }

    componentDidMount() {
        this.scrollToBot();

        this.getChatroom(this.props.netid)
          .then(res =>
            this.setState({
              chats: res.chats.map((chat) => {
                chat.username = chat.sender;
                chat.content = <p>{chat.message}</p>;
                return chat;
              })
            })
          )
          .catch(err => console.log(err));
    }

    getChatroom = async netid => {
        const response = await fetch("/api/chatroom?id=" + netid);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
    }

    submitMessage(e) {
        e.preventDefault();

        this.setState({
            chats: this.state.chats.concat([{
                username: "Kevin Hsu",
                content: <p>{ReactDOM.findDOMNode(this.refs.msg).value}</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }])
        }, () => {
            ReactDOM.findDOMNode(this.refs.msg).value = "";
        });
    }

    render() {
        const username = "Kevin Hsu";
        const { chats } = this.state;

        return (
            <div className="chatroom">
                <h3>Chilltime</h3>
                <ul className="chats" ref="chats">
                    {
                        chats.map((chat) =>
                            <Message chat={chat} user={username} />
                        )
                    }
                </ul>
                <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" ref="msg" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default Chatroom;
