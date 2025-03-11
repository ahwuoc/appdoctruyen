"use client";
import { useEffect, useState } from "react";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import io, { Socket } from "socket.io-client";

let socket: Socket | undefined;

export default function ChatButton()
{
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");

    useEffect(() =>
    {
        socketInitializer();

        return () =>
        {
            socket?.disconnect();
        };
    }, []);

    const socketInitializer = async (): Promise<void> =>
    {
        socket = io("http://localhost:4000");

        socket.on("receive-message", (message: string) =>
        {
            setMessages((prev) => [...prev, message]);
        });
    };

    const sendMessage = () =>
    {
        if (input.trim() && socket) {
            socket.emit("send-message", input);
            setInput("");
        }
    };

    return (
        <div className="p-6 fixed bottom-0 right-0">
            <div className="relative">
                {/* Nút chat */}
                <div
                    className="bg-purple-700 cursor-pointer p-5 rounded-full text-white text-2xl"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <MdOutlineMarkUnreadChatAlt />
                </div>

                {/* Hộp chat */}
                {isOpen && (
                    <div className="bg-color_puppy w-96 h-96 p-4 absolute bottom-20 right-0 rounded-lg shadow-lg">
                        <div className="overflow-y-auto h-72">
                            {messages.map((msg, index) => (
                                <p key={index} className="text-white">
                                    {msg}
                                </p>
                            ))}
                        </div>
                        <div className="mt-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setInput(e.target.value)
                                }
                                className="w-full p-2 rounded"
                                placeholder="Nhập tin nhắn..."
                            />
                            <button
                                onClick={sendMessage}
                                className="mt-2 bg-purple-700 text-white p-2 rounded"
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}