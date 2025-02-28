import React, { useState } from "react";
import { Input, Space, Button } from "antd";
import { AudioOutlined } from "@ant-design/icons";

const SearchComponent: React.FC = () => {
    const [searchText, setSearchText] = useState("");

    const startRecognition = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "vi-VN"; 

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setSearchText(text);
            console.log(text)
        };
        recognition.start();
    };

    return (
        <Space direction="vertical">
            <Space>
                <Input
                    placeholder="Tìm kiếm truyện"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    suffix={
                        <AudioOutlined
                            className="site-form-item-icon"
                            onClick={startRecognition}
                            style={{ cursor: "pointer" }}
                        />
                    }
                />
                <Button onClick={() => console.log("Tìm kiếm:", searchText)}>Search</Button>
            </Space>
        </Space>
    );
};

export default SearchComponent;
