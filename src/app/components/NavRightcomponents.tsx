import React from "react";
import { Tabs, Typography } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import CardTOPBXH from "./card_top_album";
import CardUserTop from "./card_top_bxh";
import Image from "next/image";
const itemsData2 = [
    {
        key: "1",
        label: (
            <Typography
                style={{ color: "white" }}
            >
                <CrownOutlined style={{ fontSize: 20, color: "gold" }} />
                Cảnh giới
            </Typography>
        ),
        children: (
            <>
                <CardUserTop />
            </>
        ),
    },
    {
        key: "2",
        label: (
            <Typography
                style={{ color: "white" }}>
                <CrownOutlined style={{ fontSize: 20, color: "gold" }} />
                Cảnh giới
            </Typography>
        ),
        children: "Content of Tab Pane 2",
    },

];

const itemsData = [
    {
        key: "1",
        label: (
            <Typography
                style={{ color: "white" }}
            >

                <CrownOutlined style={{ fontSize: 20, color: "gold" }} />
                Top tuần
            </Typography>
        ),
        children: (
            <CardTOPBXH />
        ),
    },
    {
        key: "2",
        label: (
            <Typography
                style={{ color: "white" }}>
                <CrownOutlined style={{ fontSize: 20, color: "gold" }} />
                Top tháng
            </Typography>
        ),
        children: "Content of Tab Pane 2",
    },
    {
        key: "3",
        label: (
            <Typography
                style={{ color: "white" }}>
                <CrownOutlined style={{ fontSize: 20, color: "gold" }} />
                Top năm
            </Typography>
        ),
        children: "Content of Tab Pane 3",
    }
];

const NavRight = () => {
    const onChange = (key: string): void => {
        console.log(`Active tab: ${key}`);
    };
    return (
        <div className="bg-bg_color text-center  w-full rounded-sm">
            <div className="container flex justify-center gap-2  items-center">
                <Image src="https://cmangax.com/assets/img/premium.png" width={40} height={40} alt="name" />
                <div className="flex flex-col items-start" >
                    <Typography style={{color:"white"}}>Thành viên VIP</Typography>
                    <Typography.Text style={{color:"white"}}>Đọc truyện không quảng cáo </Typography.Text>
                </div>
            </div>
            <Tabs defaultActiveKey="1" items={itemsData} onChange={onChange} />
            <Tabs defaultActiveKey="1" items={itemsData2} onChange={onChange} />
        </div>



    );
};
export default NavRight;
