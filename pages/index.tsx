/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

//test
import { getAllPosts, getBlocks } from "../lib/notion";
import Typical from "react-typical";
import Link from "next/link";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>KirilDev</title>
            </Head>

            <div className="mx-auto max-w-3xl px-6 text-black  justify-center flex flex-col font-medium">
                <img
                    className="rounded-full object-cover "
                    src="/images/avatar1.png"
                    alt="avatar"
                    width={120}
                    height={120}
                />

                <h1 className="heading-text my-8 font-bold text-4xl">
                    <Typical
                        steps={["Hi,", 1000, "Tuấn Anh Here 👏", 1000]}
                        loop={Infinity}
                        wrapper="p"
                    />
                </h1>

                <p className="mb-8 leading-7 ">Student / Developer  </p>

                <div className="leading-7">
                    Study Information Security at{" "}
                    <a
                        href="http://actvn.edu.vn/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600/10 text-emerald-600 p-1 rounded font-bold transition-all duration-150 hover:bg-emerald-600/20"
                    >
                        🎓 KMA
                    </a>{" "}
                    (Academy Of Cryptography Techniques)
                </div>

                <div className="mb-8 mt-8">
                    More about me:{" "}
                    <Link href="/projectsnsocials">
                        <a className="underline"> Projects & Socials </a>
                    </Link>
                    <div>
                        And check my blog: {" "}
                        <Link href="/blog">
                            <a className="underline">Blog </a>
                        </Link>
                    </div>
                </div>

                <p>Most of my work can be found on GitHub.</p>
            </div>
        </>
    );
};

export default Home;
