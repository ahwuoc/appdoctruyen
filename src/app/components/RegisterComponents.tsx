"use client";
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input, Form, Button } from 'antd';
import { LockOutlined, MailOutlined,EyeOutlined ,  UserOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { RegisterInput, registerSchema } from '../schema/schema-register';

import apiAuth from '@/app/apiRequest/apiAuth';

const RegisterComponents = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterInput) => {
          const response  = await apiAuth.register(data);
            console.log(response.payload);
            console.log(response.payload.message);
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='bg-customBg text-white border-customBg2'>
                    Đăng ký
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Đăng ký</DialogTitle>
                    <DialogDescription>
                        Hãy điền vào thông tin dưới đây để đăng ký tài khoản.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Item>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="name"
                                    addonBefore={<UserOutlined />}
                                    placeholder="Tên"
                                />
                            )}
                        />
                        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                    </Form.Item>

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
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <Input.Password
                                    {...field}
                                    id="confirmPassword"
                                    addonBefore={<LockOutlined />}
                                    type="password"
                                    placeholder="Xác nhận mật khẩu"
                                />
                            )}
                        />
                        {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
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

export default RegisterComponents;