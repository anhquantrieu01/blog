import React from "react";
import { useParams, Link } from "react-router-dom";
import { usePostBySlug } from "../../features/posts/api/getPostBySlug";
import { paths } from "../../config/paths";
import Head from "../../components/seo/head";
import CommentSection from "../../components/commentSection";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = usePostBySlug(slug || "");

  if (!slug) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <p>Invalid post ID.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <p>Bài viết không tồn tại.</p>
      </div>
    );
  }

  return (
    <>
      <Head title={post.title} />
      <section className="bg-dark10 text-white px-6 py-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link
            to={paths.posts.root.getHref()}
            className="text-yellow55 hover:text-yellow80 text-sm"
          >
            ← Quay về danh sách bài viết
          </Link>

          <div className="space-y-4">
            <p className="text-xs text-white">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "-"}
            </p>
            <h1 className="text-4xl font-bold">{post.title ?? "Untitled"}</h1>
          </div>

          {post.thumbnailUrl && (
            <div className="overflow-hidden rounded-xl">
              <img
                src={post.thumbnailUrl}
                alt={post.title ?? "Blog image"}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-invert text-gray-50 mt-6 "
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          />
        </div>
      </section>
      {post && post.id && (
        <CommentSection postId={post.id} />
      )}
    </>
  );
}
