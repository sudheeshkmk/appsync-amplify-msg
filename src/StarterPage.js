'use client';
import { v4 as uuidv4 } from "uuid";

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { useEffect, useState } from 'react';

import { ToastContainer, toast } from "react-toastify";
import { onCreateMessage } from './graphql/subscriptions';
import "react-toastify/dist/ReactToastify.css";

import config from './aws-exports.js';

Amplify.configure(config);

const client = generateClient();

export default function StarterPage() {
    const [received, setReceived] = useState([]);

    // Define the channel name here
    let roomId = '123';


    // subscribe to events
    useEffect(() => {
        const sub = client.graphql({ query: onCreateMessage, variables: { roomId } }).subscribe({
            next: (data) => {
                // console.log(...data)
                const newmsg = data.data.onCreateMessage
                // setReceived(newmsg)
                setReceived((prev) => [...prev, newmsg])
                toast.info(`New Message: ${newmsg.content}`);

                // console.log("Received", data.subscribe.data)
            },
            error: (error) => console.warn(error),
        });
        return () => sub.unsubscribe();
    }, [roomId]);

    return (
        <div className="App">
            <header className="App-header">
                <p>Subscribed/Listening to channel &quot;{roomId}&quot;...</p>
                <div>
                    <ToastContainer />

                    <div className="chat-box">
                        {received.map((msg) => (
                            <div key={uuidv4()} className="chat-message">
                                <span className="message-content">{msg.content}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </header>
        </div>
    );
}