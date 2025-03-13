// 'use client';
import { v4 as uuidv4 } from "uuid";

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { useEffect, useState } from 'react';

import { ToastContainer, toast } from "react-toastify";
import { onMessagePublishedByAppId } from './graphql/subscriptions';
import "react-toastify/dist/ReactToastify.css";

import config from './aws-exports.js';

Amplify.configure(config);

const client = generateClient();

let appId = 'Polaris';
export default function StarterPage() {
    const [received, setReceived] = useState([]);

    // Define the channel name here

    console.log("starting starter...")
    // subscribe to events
    useEffect(() => {
        console.log("subscribing...",appId);
        const sub = client.graphql({ query: onMessagePublishedByAppId, variables: { appId } }).subscribe({
            next: (data) => {
                const newmsg = data.data.onMessagePublishedByAppId
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
                <p>Subscribed to application &quot;{appId}&quot;...</p>
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