import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiMenu } from "react-icons/fi";

import Link from "next/link";

import ThemeToggle from "./ThemeToggle";

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
    return (
        <header className="z-20 flex items-center px-4 py-3 justify-between sticky top-0 backdrop-blur-lg text-gray-500 border-b border-transparent dark:text-dark-100">
            <Link href="/">
                <h1 className="font-serif text-lg text-black duration-150 cursor-pointer hover:text-accent-600 dark:text-white dark:hover:text-accent-400">
                    Kiril
                </h1>
            </Link>

            <div className="flex items-center space-x-2 ">
                <nav className="hidden items-center space-x-1 sm:flex">
                    {navigations.map((n, i) => (
                        <Link href={n.link} key={i} passHref>
                            <a className="nav-links rounded-lg p-3 transition-colors hover:text-accent-600 dark:hover:text-accent-400">
                                {n.name}
                            </a>
                        </Link>
                    ))}
                </nav>

                <ThemeToggle />

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
                            <Menu.Items className="bg-white text-black absolute right-0 mt-2 w-40 origin-top-right rounded-lg shadow-lg grid divide-y divide-light-800 border border-light-800 dark:divide-dark-600 dark:border-dark-600 dark:bg-dark-700 dark:text-dark-50 focus:outline-none ">
                                {navigations.map((n, i) => (
                                    <Menu.Item key={i}>
                                        <MenuItemLink href={n.link}>
                                            <div className="p-3 transition-colors hover:text-accent-600 dark:hover:text-accent-400">
                                                {n.name}
                                            </div>
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
