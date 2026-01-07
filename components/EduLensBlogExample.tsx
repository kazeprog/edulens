import { blogClient } from "@/lib/mistap/microcms";

// EduLensブログの型定義（例）
type EduLensBlog = {
    id: string;
    title: string;
    publishedAt: string;
};

export default async function EduLensBlogList() {
    const { contents } = await blogClient.getList<EduLensBlog>({
        endpoint: "blogs", // EduLens側のエンドポイント名に合わせる
    });

    return (
        <ul>
            {contents.map((post) => (
                <li key={post.id}>{post.title}</li>
            ))}
        </ul>
    );
}
