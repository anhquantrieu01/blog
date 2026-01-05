import { Link } from "react-router-dom";
import { useLatestPosts } from "../features/posts/api/getLatestPosts";

export default function RecentPosts() {
  const { data, isLoading } = useLatestPosts(4);

  if (isLoading) return <div className="px-6 py-16 text-white">Loading...</div>;
  if (!data?.length) return null;

  const posts = data.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    date: new Date(p.createdAt).toLocaleDateString("en-US"),
    description: p.summary,
    image: p.thumbnailUrl,
    categoryName: p.categoryName,
  }));

  const bigPost = posts[1];
  const smallPosts = posts.slice(2);

  return (
    <section id="latest-posts" className="bg-dark08 px-6 py-16 text-gray90">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-12 text-white">
          Bài viết mới nhất
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* BIG POST */}
          <Link
            to={`/posts/${bigPost.slug}`}
            className="md:col-span-2 text-white group cursor-pointer rounded-lg overflow-hidden shadow-lg"
          >
            <article>
              <div className="overflow-hidden">
                <img
                  alt={bigPost.title}
                  src={bigPost.image}
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6 bg-dark15 group-hover:bg-dark20 transition-colors">
                <p className="text-yellow80 text-xs">{bigPost.date}</p>
                <h3 className="text-2xl font-semibold mt-2 group-hover:text-yellow55">
                  {bigPost.title}
                </h3>
                <p className="text-gray70 mt-2 line-clamp-4">
                  {bigPost.description}
                </p>
              </div>
            </article>
          </Link>

          {/* SMALL POSTS */}
          <div className="flex flex-col gap-6">
            {smallPosts.map((post) => (
              <Link
                to={`/posts/${post.slug}`}
                key={post.id}
                className="group text-white cursor-pointer rounded-lg overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl transition-all bg-dark15 group-hover:bg-dark20"
              >
                <div className="flex md:flex-row flex-col h-full">
                  <div className="relative md:w-1/2 overflow-hidden">
                    <img
                      alt={post.title}
                      src={post.image}
                      className="w-full h-40 md:h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <p className="text-yellow80 text-xs">{post.date}</p>
                    <h3 className="text-lg font-semibold mt-2 group-hover:text-yellow55">
                      {post.title}
                    </h3>
                    <p className="text-gray70 text-sm mt-1 line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
