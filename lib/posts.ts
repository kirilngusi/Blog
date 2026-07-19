// Normalized post metadata derived from a raw Notion database row, so every
// consumer (blog list, post page, RSS, sitemap) reads the same clean shape.

export interface PostMeta {
    id: string;
    title: string;
    description: string;
    slug: string;
    date: string; // "YYYY-MM-DD"
    tags: string[];
    lang: string;
}

// Estimate reading time (minutes) from a react-notion-x recordMap by counting
// words across all text blocks (~200 words/min).
export const readingTimeMinutes = (recordMap: any): number => {
    if (!recordMap?.block) return 1;
    let words = 0;
    for (const key of Object.keys(recordMap.block)) {
        const title = recordMap.block[key]?.value?.properties?.title;
        if (Array.isArray(title)) {
            for (const seg of title) {
                if (Array.isArray(seg) && typeof seg[0] === "string") {
                    words += seg[0].split(/\s+/).filter(Boolean).length;
                }
            }
        }
    }
    return Math.max(1, Math.round(words / 200));
};

const richText = (prop: any): string =>
    prop?.rich_text?.[0]?.plain_text ??
    prop?.rich_text?.[0]?.text?.content ??
    "";

export const toPostMeta = (row: any): PostMeta => {
    const p = row?.properties ?? {};
    return {
        id: row?.id ?? "",
        title:
            p.Title?.title?.[0]?.plain_text ??
            p.Title?.title?.[0]?.text?.content ??
            "",
        description: richText(p.Description),
        slug: richText(p.slug).trim(),
        date: p.Date?.date?.start ?? row?.created_time?.split("T")[0] ?? "",
        tags: (p.Tag?.multi_select ?? []).map((t: any) => t.name),
        lang: p.Lang?.select?.name ?? "",
    };
};

export const formatDate = (iso?: string): string => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
