import React from "react";
import { NotionRenderer } from "react-notion-x";

import { getAllPosts, getBlocks, getPage, test } from "../../lib/notion";
import { NotionAPI } from "notion-client";

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
    // console.log(blocks)
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

            
            {/*
            //style dark mode 
            .notion-app {
                    background: #282a36;
                    color: white;
            } */}

            <style global jsx>{`
                
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
    const slugMapping = allPosts.map((p: any) => {
        if (!p.properties.slug.rich_text[0]?.plain_text.toString()) {
            //fallback to 404 page
            return {
                params: {slug: "404-not-found"},
            };
        }
        return{
            params: {
                slug: p.properties.slug.rich_text[0]?.plain_text.toString()
            }
        }
    });
    return {
        paths: slugMapping,
        fallback: false,
    };
};

export const getStaticProps = async ({ params }: { params: any }) => {
    const db = await getAllPosts(params.slug)
    const post = db.find((t:any) => t.properties.slug.rich_text[0].text.content === params?.slug);
    
    if (!post) {
        return {
          notFound: true,
        };
    }
    
    const notion = new NotionAPI();
    const blocks = await notion.getPage(post.id);

    // console.log(posts)
    return {
        props: { blocks },
        revalidate: 60,
    };
};
