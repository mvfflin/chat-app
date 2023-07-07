import { useState } from "react";
import io from "socket.io-client";
import "./App.css";
import ChatPage from "./ChatPage";

const socket = io.connect("http://localhost:3001");

function App() {
    const [username, setUsername] = useState("");
    const [roomID, setRoomID] = useState("");
    const [showChat, setShowChat] = useState(false);

    const joinRoom = () => {
        if (username != "" && roomID != "") {
            socket.emit("join_room", roomID);
            setShowChat(true);
        }
    };

    return (
        <>
            {showChat == false ? (
                <div className="App">
                    <form>
                        <h1>Join room</h1>
                        <h3>Username</h3>
                        <input
                            type="text"
                            placeholder="Username"
                            id="inputUsername"
                            onChange={(event) => {
                                setUsername(event.target.value);
                            }}
                        />

                        <h3>Room id</h3>
                        <input
                            type="text"
                            placeholder="Room id"
                            id="inputRoomID"
                            onChange={(event) => {
                                setRoomID(event.target.value);
                            }}
                        />

                        <button type="button" onClick={joinRoom}>
                            Submit
                        </button>
                    </form>
                </div>
            ) : (
                <ChatPage socket={socket} username={username} roomID={roomID} />
            )}
        </>
    );
}

export default App;
