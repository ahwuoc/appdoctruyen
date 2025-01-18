import React from 'react';
import Image from 'next/image'
import SearchComponent from '../Components/SearchComponents';
import RegisterComponents from '../Components/RegisterComponents';
import LoginComponents from '../Components/LoginComponents';
const Header = () => {
    return (
        <div className='container mx-auto  bg-customBg'>
            <div className="flex w-[80%] mx-auto justify-between bg-customBg ">
                <div className="flex-1 flex gap-5 items-center ">
                    <div className="logo">
                        <Image
                            src="https://cmangag.com/assets/img/brand/cmanga/logo-white.png"
                            width={300}
                            height={300}
                            alt="logo"
                        />
                    </div>
                    <SearchComponent />
                </div>
                <div className="flex-1 flex justify-end gap-2 items-center">
                <RegisterComponents />
                <LoginComponents />
                 </div>
            </div>
        </div>
    );
}

export default Header;
