"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const RegisterComponents = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='bg-customBg text-white border-customBg2' variant="outline">Đăng ký</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle >Đăng ký</DialogTitle>
                    <DialogDescription>
                        Hãy điền vào thông tin dưới đây để đăng ký tài khoản.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Tên hiển thị
                        </Label>
                        <Input
                            id="name"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Tên đăng nhập
                        </Label>
                        <Input
                            id="username"
                            
                            className="col-span-3"
                        />
                    </div>
                  
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Mật khẩu
                        </Label>
                        <Input
                            id="password"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                           Nhập lại mật khẩu
                        </Label>
                        <Input
                            id="password"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter >
                    <Button className='mx-auto bg-customBg2' type="submit">Đăng ký</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default RegisterComponents;
