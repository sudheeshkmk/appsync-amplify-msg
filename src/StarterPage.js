// 'use client';
import { v4 as uuidv4 } from "uuid";

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { useEffect, useState } from 'react';

import { ToastContainer, toast } from "react-toastify";
import { onMessageByRoomId } from './graphql/subscriptions';
import "react-toastify/dist/ReactToastify.css";

import config from './aws-exports.js';

Amplify.configure(config);

const client = generateClient();

let roomId = '123';
export default function StarterPage() {
    const [received, setReceived] = useState([]);

    // Define the channel name here

    console.log("starting starter...")
    // subscribe to events
    useEffect(() => {
        console.log("subscribing...",roomId);
        const sub = client.graphql({ query: onMessageByRoomId, variables: { roomId } }).subscribe({
            next: (data) => {
                const newmsg = data.data.onMessageByRoomId
                setReceived((prev) => [...prev, newmsg])
                toast.info(`New Message: ${newmsg.content}`);
            },
            error: (error) => console.warn(error),
        });
        return () => sub.unsubscribe();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <p>Subscribed to Space &quot;{roomId}&quot;...</p>
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