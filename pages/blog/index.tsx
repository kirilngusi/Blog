import React from "react";
import { NotionRenderer } from "react-notion-x";
import { NotionAPI } from "notion-client";
import { GetStaticProps } from "next";

import { Code } from "react-notion-x/build/third-party/code";
import { Collection } from "react-notion-x/build/third-party/collection";
import { Equation } from "react-notion-x/build/third-party/equation";
import { Pdf } from "react-notion-x/build/third-party/pdf";
import { Modal } from "react-notion-x/build/third-party/modal";

import { ExtendedRecordMap } from "notion-types";

import { getAllPosts, getBlocks, getPage, test } from "../../lib/notion";

import Link from "next/link";

import dayjs from "dayjs";


const allPost = ({ response }: { response: any}) => {
    // console.log(response);
    return (
        <div className="mx-auto	text-white  max-w-3xl container px-6">
            <section className="mb-10">
                <h1 className="heading-text mb-8 text-4xl font-bold">Blog</h1>
                <p className="tracking-wider leading-7 py-3">
                    Welcome to my blog. I write about things that interest me,
                    mostly about web development, productivity, and being a
                    life-long learner.
                </p>
                <input
                    className="outline-0 w-full bg-secondary rounded p-2"
                    type="text"
                    placeholder="Search Posts"
                />
            </section>
            <h1 className="text-4xl font-bold text-white mb-12">
                Most Popular
            </h1>
            <div className="mx-auto	">
                {response.map((result: any, key: number) => (
                    <div key={key} className="mb-12">
                        <div className="text-white">
                            <div className="text-2xl text-link font-bold cursor-pointer hover:underline">
                                {/* <Link href={`blog/${result.properties.slug.rich_text[0].plain_text}`}> */}
                                <Link href={`/blog/${result.id}`}>
                                    {
                                        result.properties.Title.title[0].text.content
                                    }
                                </Link>
                            </div>
                            <div>
                                {
                                    result.properties.Description.rich_text[0].text.content
                                }
                            </div>
                            <div>{result.created_time.split("T")[0]}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default allPost;

export const getStaticProps = async () => {
    const response = await getAllPosts();
    // const response = await getBlocks('4a49d049-936b-4958-bee7-1964e8d1041b')

    return {
        props: {
            response,
        },
    };
};
