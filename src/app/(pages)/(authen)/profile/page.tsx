"use client"; // Client Component cho Next.js

import React, { useEffect, useRef } from "react";
import { Avatar, Card, List, Space, Badge, Typography, Tabs, Timeline, Progress, Button } from "antd";
import
{
    FaEdit,
    FaSignOutAlt,
    FaDesktop,
    FaMobileAlt,
    FaGlobe,
    FaBook,
    FaStar,
} from "react-icons/fa";
import { gsap } from "gsap";

const { Title, Text } = Typography;

interface UserProfile
{
    name: string;
    email: string;
    avatar: string;
    phone: string;
    location: string;
    points: number;
    level: number;
    previousLogins: { ip: string; device: string; time: string; }[];
    favoriteManga: string[];
    levelProgress: number; // Tiến trình đến level tiếp theo (0-100%)
}

const fakeProfile: UserProfile = {
    name: "Quốc Nguyễn",
    email: "quoc.nguyen@example.com",
    avatar: "/avatars/fake-avatar.jpg",
    phone: "+84 123 456 789",
    location: "Hà Nội, Việt Nam",
    points: 1500,
    level: 5,
    previousLogins: [
        { ip: "192.168.1.1", device: "Desktop", time: "2025-03-08 14:30" },
        { ip: "10.0.0.5", device: "Mobile", time: "2025-03-07 09:15" },
        { ip: "172.16.254.1", device: "Tablet", time: "2025-03-06 20:45" },
    ],
    favoriteManga: ["One Piece", "Naruto", "Attack on Titan"],
    levelProgress: 75,
};

export default function ProfilePage()
{
    const profile = fakeProfile;
    const sidebarRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // GSAP Animation
    useEffect(() =>
    {
        gsap.from(sidebarRef.current, {
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: "power3.out",
        });
        gsap.from(contentRef.current, {
            opacity: 0,
            x: 50,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.2,
        });
    }, []);

    return (
        <div className="container flex mx-auto p-6">
            {/* Sidebar */}
            <div ref={sidebarRef} className="w-1/3">
                <Card className="">
                    <div className="flex flex-col items-center">
                        <Avatar size={100} src={profile.avatar} />
                        <Title level={3} className="mt-3">{profile.name}</Title>
                        <Text type="secondary">{profile.email}</Text>
                        <Space direction="vertical" className="mt-3">
                            <Text><FaGlobe /> {profile.location}</Text>
                            <Text><FaMobileAlt /> {profile.phone}</Text>
                        </Space>
                        <Button type="primary" icon={<FaEdit />} className="mt-4">Chỉnh sửa</Button>
                    </div>
                </Card>
            </div>

            <div ref={contentRef} className="w-2/3">
                <Tabs defaultActiveKey="1">
                    {/* Cấp độ & Điểm số */}
                    <Tabs.TabPane tab="Cấp độ" key="1">
                        <Card>
                            <Title level={4}>Cấp độ {profile.level}</Title>
                            <Progress percent={profile.levelProgress} />
                            <Text strong>{profile.points} điểm</Text>
                        </Card>
                    </Tabs.TabPane>

                    {/* Lịch sử đăng nhập */}
                    <Tabs.TabPane tab="Lịch sử đăng nhập" key="2">
                        <List
                            dataSource={profile.previousLogins}
                            renderItem={(item) => (
                                <List.Item>
                                    <Space>
                                        {item.device === "Desktop" ? <FaDesktop /> : <FaMobileAlt />}
                                        <Text strong>{item.device}</Text>
                                        <Text type="secondary">{item.ip}</Text>
                                        <Text>{item.time}</Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Tabs.TabPane>

                    {/* Manga yêu thích */}
                    <Tabs.TabPane tab="Manga yêu thích" key="3">
                        <List
                            dataSource={profile.favoriteManga}
                            renderItem={(manga) => (
                                <List.Item>
                                    <Space>
                                        <FaBook />
                                        <Text strong>{manga}</Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </div>
    );
}
