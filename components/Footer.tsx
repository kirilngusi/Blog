import React from "react";
import { SiNextdotjs, SiNotion, SiVercel } from 'react-icons/si'

const Footer = () => {
    return (
        <footer className="primary-text p-6 text-center text-xs">
            <div className="my-2 inline-flex items-center space-x-2 ">

                <div className="bg-inherit">
                <SiNextdotjs size={16}/>
                </div>

                <SiNotion size={16} />
                <SiVercel size={16} />
            </div>
            <div></div>
            <div className="">
                ©️ 2022 - {new Date().getFullYear()}
            </div>
        </footer>
    );
};

export default Footer;
