import React from 'react';
import Image from 'next/image'
import SearchComponent from '../Components/SearchComponents';
import RegisterComponents from '../Components/RegisterComponents';
import LoginComponents from '../Components/LoginComponents';
import {CashModal} from '../Components/CashModal';
import { Notification } from '../Components/NotificationComponents';
const Header = () => {
    const isLogin = true;

    return (
        <div className='container  min-w-full  bg-customBg'>
            <div className="flex w-[80%] mx-auto justify-between bg-customBg ">
                <div className="flex-1 flex gap-5 items-center ">
                    <div className="logo">
                        <Image
                            src="https://cmangag.com/assets/img/brand/cmanga/logo-white.png"
                            width={150}
                            height={150}
                            alt="logo"
                            className='py-5'
                        />
                    </div>
                    <SearchComponent />
                </div>
                <div className="flex-1 flex justify-end gap-2 items-center">
                    {isLogin ? (
                        <div className='flex items-center gap-2 '>
                             <CashModal />
                             <Notification />
                        </div>
                    ) : (
                        <div className="flex gap-2 user_auth_not_logged_in">
                        <RegisterComponents />
                        <LoginComponents />
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
