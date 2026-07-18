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
