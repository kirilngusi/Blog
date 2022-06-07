import React from "react";
import { NotionRenderer } from "react-notion-x";

import { getAllPosts, getBlocks, getPage, test } from "../../lib/notion";

import { Collection } from "react-notion-x/build/third-party/collection";
import { Equation } from "react-notion-x/build/third-party/equation";
import { Pdf } from "react-notion-x/build/third-party/pdf";

import dynamic from "next/dynamic";

const Code = dynamic(async () => {
    const m = await import("react-notion-x/build/third-party/code");
    return m.Code;
});

const Modal = dynamic(
    async () => {
        const m = await import("react-notion-x/build/third-party/modal");
        return m.Modal;
    },
    {
        ssr: false,
    }
);

const singlePost = ({ blocks }: { blocks: any }) => {
    return (
        <div className="container mx-auto max-w-3xl px-1 lg:max-w-5xl">
            <NotionRenderer
                components={{
                    Code,
                    // Collection,
                    Equation,
                    Modal,
                    Pdf,
                }}
                recordMap={blocks}
                fullPage={true}
                darkMode={false}
                showTableOfContents={true}
                minTableOfContentsItems={3}
            />
            <style global jsx>{`
                .notion-app {
                    background: #282a36;
                    color: white;
                }
                .notion-header {
                    display: none;
                }
                .notion-frame main {
                    width: 100%;
                }
                .notion-aside-table-of-contents {
                    max-width: 250px;
                    background: inherit;
                }
          
                .notion-table-of-contents-item {
                    white-space: wrap;
                    line-height: 1.25rem;
                    color: white;
                    font-weight: normal;


                }
                .notion-page-cover-wrapper .notion-page-cover {
                    display: none
                }
            `}</style>
        </div>
    );
};

export default singlePost;

export const getStaticPaths = async () => {
    const allPosts = await getAllPosts();
    // console.log(allPosts);
    return {
        paths: allPosts.map((post: any) => ({
            params: {
                slug: post.properties.slug.rich_text[0].text.content,
            },
        })),
        fallback: "blocking",
    };
};

export const getStaticProps = async ({ params }: { params: any }) => {
    // console.log(params);
    // const res = await getBlocks('4a49d049-936b-4958-bee7-1964e8d1041b') as any;

    // const blocks = await JSON.parse(JSON.stringify(res));

    // const notion = new NotionAPI();
    // const blocks = await notion.getPage('4a49d049-936b-4958-bee7-1964e8d1041b');

    // const blocks1 = await fetch(
    //     "https://notion-api.splitbee.io/v1/page/Timecut-anime-js-Bootstrap-9b76d77e0cf8445d81493caddc4d9351"
    // );
    // const blocks = await blocks1.json();

    const blocks = await test(params.slug);

    return {
        props: { blocks },
        // revalidate: 60,
    };
};
