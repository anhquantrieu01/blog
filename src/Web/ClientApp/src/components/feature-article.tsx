import React from "react";
import { ArrowRight } from "lucide-react";
import { useLatestPosts } from "../features/posts/api/getLatestPosts";
import { Link } from "react-router-dom";

export default function FeaturedArticle() {
  const { data, isLoading } = useLatestPosts(1);

  if (isLoading) return <div className="px-6 py-16 text-white">Loading...</div>;
  if (!data?.length) return null;

  return (
    <section className="text-gray90 mt-12 px-6">
      <div className="max-w-6xl mx-auto">
        {data.map((post: any) => (
          <Link
            to={`/posts/${post.slug}`}
            key={post.id}
            className="group text-white flex flex-col md:flex-row items-stretch rounded-xl overflow-hidden bg-dark15 hover:bg-dark20 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow55/20"
          >
            <div className="relative md:w-1/2 overflow-hidden">
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="w-full h-64 md:h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>

            <div className="flex flex-col justify-center md:w-1/2 p-6 md:p-10 space-y-4">
              <p className="text-yellow80 text-sm font-medium">
                {new Date(post.createdAt).toLocaleDateString("en-US")}
              </p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-yellow55">
                  {post.title}
                </h3>
                <ArrowRight className="w-5 h-5 text-gray70 group-hover:text-yellow55 transition-colors" />
              </div>
              <p className="text-gray70 leading-relaxed text-sm md:text-base">
                {post.summary}
              </p>
              <div className="flex gap-3 mt-4 flex-wrap">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full bg-yellow60/20 text-yellow55`}
                >
                  {post.categoryName}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
