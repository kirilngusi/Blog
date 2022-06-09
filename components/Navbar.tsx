import { Menu, Transition, Switch } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FiMenu, FiRss } from "react-icons/fi";

import Image from "next/image";
import Link from "next/link";

const navigations = [
    {
        name: "Blog",
        link: "/blog",
    },
    {
        name: "Projects & Socials",
        link: "/projectsnsocials",
    },
];

const MenuItemLink = (props: { href: string; children: React.ReactNode }) => {
    const { href, children, ...rest } = props;
    return (
        <Link href={href}>
            <a {...rest}>{children}</a>
        </Link>
    );
};

const Navbar = () => {
    const [enabled, setEnabled] = useState(false);
    return (
        <header className="primary-text z-10 flex items-center px-4 py-3 justify-between sticky top-0 backdrop-blur-lg">
            <Link href="/">
                {/* <Image
                    className="bg-white	 duration-150 cursor-pointer hover:opacity-80"
                    src="/images/home-1.png"
                    alt="home"
                    width={42}
                    height={42}
                /> */}
                <h1 className="text-white duration-150 cursor-pointer hover:opacity-80">Home</h1>
            </Link>

            <div className="flex items-center space-x-4 text-white">
                <nav className="hidden items-center space-x-2 sm:flex">
                    {navigations.map((n, i) => (
                        <Link href={n.link} key={i} passHref>
                            <a className="nav-links p-3">{n.name}</a>
                        </Link>
                    ))}
                    <Switch
                        checked={enabled}
                        onChange={setEnabled}
                        className={`${
                            enabled ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                        <span className="sr-only">Enable notifications</span>
                        <span
                            className={`${
                                enabled ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white`}
                        />
                    </Switch>
                </nav>

                <div className="block sm:hidden">
                    <Menu as="div" className="relative text-left">
                        <Menu.Button className="flex items-center text-current">
                            <FiMenu size={20} />
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition duration-150 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Menu.Items className="bg-white text-black absolute right-0 mt-2 w-40 origin-top-right rounded shadow-lg grid divide-y  dark:bg-dark-700 focus:outline-none ">
                                {navigations.map((n, i) => (
                                    <Menu.Item key={i}>
                                        <MenuItemLink href={n.link}>
                                            <div className="p-2">{n.name}</div>
                                        </MenuItemLink>
                                    </Menu.Item>
                                ))}
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
