import React, {useState} from "react";
import {NotionRenderer} from "react-notion-x";
import {NotionAPI} from "notion-client";
import {GetStaticProps} from "next";

import {Code} from "react-notion-x/build/third-party/code";
import {Collection} from "react-notion-x/build/third-party/collection";
import {Equation} from "react-notion-x/build/third-party/equation";
import {Pdf} from "react-notion-x/build/third-party/pdf";
import {Modal} from "react-notion-x/build/third-party/modal";

import {ExtendedRecordMap} from "notion-types";

import {getAllPosts, getBlocks, getPage, test} from "../../lib/notion";

import Highlighter from "react-highlight-words";

import Link from "next/link";

import ReactGA from "react-ga4";

import dayjs from "dayjs";

export interface SlugContent {
    text: {
        content: string;
    };
}

export interface Slug {
    rich_text: SlugContent[];
}

interface Title extends Slug {
    title: SlugContent[];
}

interface Description extends Slug {
    rich_text: SlugContent[];
}

interface IPost {
    id: string;
    slug: Slug;
    Title: Title;
    date: string;
    tag: string[];
    lang: "en" | "vi";
    Description: Description;
}

interface Result {
    properties: IPost;
    created_time: string;
}

const handleClick = () => {
    ReactGA.event({
        action: "click to read",
        category: "read"
    })
}

const AllPost = ({response}: { response: any }) => {
    // console.log(response);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredAllPosts =
        searchTerm === ""
            ? response
            : response.filter(
                (result: any) =>
                    result?.properties?.Title?.title[0]?.text?.content
                        .toLocaleLowerCase()
                        .includes(searchTerm.toLocaleLowerCase()) ||
                    result?.properties?.Description?.rich_text[0]?.text?.content
                        ?.toLocaleLowerCase()
                        .includes(searchTerm.toLocaleLowerCase())
            );

    return (
        <div className="mx-auto	text-black  max-w-3xl container px-6">
            <section className="mb-6">
                <h1 className="heading-text mb-2 text-4xl font-bold">Blog</h1>
                <p className="tracking-wider py-3 font-lg font-bold">
                    Welcome to my blog. I write about things that interest me,
                    mostly about web development, productivity, and being a
                    life-long learner.
                </p>
                <input
                    className="outline-0 w-full bg-thirdparty rounded p-2"
                    type="text"
                    placeholder="Search Posts"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                />
            </section>

            <div className="mx-auto	">
                {searchTerm === "" && (
                    <>
                        <h1 className="text-4xl  text-black mb-2 font-bold">
                            Most Popular
                        </h1>
                        {response?.map((result: Result, key: number) => (
                            <div key={key}
                                 className="border-dashed border-b-2 py-4 pb-4"
                            >
                                <div className="text-black">
                                    <div
                                        className="text-lg cursor-pointer hover:underline font-bold"
                                        onClick={handleClick}
                                    >
                                        <Link
                                            href={`/blog/${result?.properties?.slug?.rich_text[0]?.text?.content}`}
                                        >
                                            {
                                                result?.properties?.Title?.title[0]
                                                    ?.text?.content
                                            }
                                        </Link>
                                    </div>
                                    <div className="text-gray-700">
                                        {
                                            result?.properties?.Description
                                                ?.rich_text[0]?.text?.content
                                        }
                                    </div>
                                    <div className="text-gray-700">
                                        {result?.created_time?.split("T")[0]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
                {searchTerm && (
                    <>
                        <h1 className="text-4xl font-bold text-black mb-2">
                            All Posts
                        </h1>
                        {filteredAllPosts.map((result: any, key: number) => (
                            <div key={key} className="border-dashed border-b-2 py-4 pb-4">
                                <div className="text-black">
                                    <div className="text-lg cursor-pointer hover:underline font-bold">
                                        <Link
                                            href={`/blog/${result?.properties?.slug?.rich_text[0]?.text?.content}`}
                                        >
                                            <Highlighter
                                                highlightClassName=""
                                                className=""
                                                searchWords={searchTerm?.split(
                                                    " "
                                                )}
                                                autoEscape={true}
                                                textToHighlight={
                                                    result?.properties?.Title
                                                        ?.title[0]?.text
                                                        ?.content || ""
                                                }
                                            />
                                        </Link>
                                    </div>
                                    <div>
                                        <Highlighter
                                            highlightClassName="text-gray-500"
                                            className=""
                                            searchWords={searchTerm.split(" ")}
                                            autoEscape={true}
                                            textToHighlight={
                                                result?.properties?.Description
                                                    ?.rich_text[0]?.text
                                                    ?.content || ""
                                            }
                                        />
                                    </div>
                                    <div>
                                        {result?.created_time?.split("T")[0]}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredAllPosts.length === 0 && (
                            <div className="flex flex-col items-center justify-center mt-10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-gray-400 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 14l2-2m0 0l2-2m-2 2l2 2m-2-2v6m0-6H5m14 0h-4m4 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="text-gray-500 text-lg font-medium">
                                    No posts found. Try searching for something else.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllPost;

export const getStaticProps = async () => {
    const response = await getAllPosts();

    return {
        props: {
            response,
        },
        revalidate: 60,
    };
};
