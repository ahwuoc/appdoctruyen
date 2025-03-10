"use client";
import React from 'react';
import
    {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "@/components/ui/dialog";
import { Input, Form, Button } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { LoginInput, LoginSchema } from '../schema/schema-login';
import apiAuth from '../apiRequest/apiAuth';

const LoginComponents = () =>
{
    const { control, handleSubmit, formState: { errors } } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema)
    });

    const onSubmit = async (data: LoginInput) =>
    {
        const response = await apiAuth.login(data);
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='bg-customBg text-white border-customBg2'>
                    Đăng nhập
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Đăng nhập</DialogTitle>
                    <DialogDescription>
                        Hãy điền vào thông tin dưới đây để đăng nhập tài khoản.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Item>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="email"
                                    addonBefore={<MailOutlined />}
                                    placeholder="Email"
                                />
                            )}
                        />
                        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                    </Form.Item>
                    <Form.Item>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input.Password
                                    {...field}
                                    id="password"
                                    addonBefore={<LockOutlined />}
                                    type="password"
                                    placeholder="Mật khẩu"

                                />
                            )}
                        />
                        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full bg-customBg text-white border-customBg2">
                            Đăng ký
                        </Button>
                    </Form.Item>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LoginComponents;