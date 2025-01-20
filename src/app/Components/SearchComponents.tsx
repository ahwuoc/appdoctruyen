"use client";
import React, { useState } from 'react';

const SearchComponent = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <form className="flex flex-1 items-center max-w-lg">
            <div className="relative w-full">
                <input
                    type="text"
                    id="voice-search"
                    className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  pr-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Bạn muốn tìm kiếm truyện gì?"
                    required
                />
                <button type="button" className="absolute  group inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-4 h-4 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>

                </button>

            </div>
            <div className='relative inline-block '>
                <button
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    type="submit" className="inline-flex justify-center items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-customBg2 rounded-lg border border-customBg2 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z" />
                    </svg>
                </button>
                {isOpen && (
                    <div
                        className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        <ul
                            className="text-sm text-gray-700 dark:text-gray-200"
                        >
                            <span
                                className="block px-4 text-wrap py-2">
                                Tìm kiếm bằng giọng nói
                            </span>
                        </ul>
                    </div>
                )}
            </div>
        </form>
    );
};

export default SearchComponent;
