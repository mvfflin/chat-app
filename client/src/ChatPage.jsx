import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./ChatPage.css";

const ChatPage = ({ socket, username, roomID }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messagesList, setMessagesList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage != "") {
            const messageData = {
                room: roomID,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessagesList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log(data);
            setMessagesList((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <>
            <div className="ChatPage">
                <h1 className="chat-header">Room {roomID} live chat</h1>
                <div className="chat-body">
                    {messagesList.map((messageContent) => {
                        return (
                            <div
                                className="message"
                                id={
                                    username == messageContent.author
                                        ? "you"
                                        : "other"
                                }
                            >
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">
                                            {messageContent.author}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="chat-footer">
                    <input
                        value={currentMessage}
                        type="text"
                        placeholder="type a message..."
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    />
                    <button type="button" onClick={sendMessage}>
                        {">>"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatPage;
