import { useListNews } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Calendar } from "lucide-react";

export default function News() {
  const { data, isLoading } = useListNews({ limit: 10 });

  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
      <h1 className="font-display text-5xl font-bold text-white uppercase tracking-wider mb-12">Latest Transmission</h1>

      {isLoading ? (
        <div className="space-y-12 animate-pulse">
          {[1,2].map(i => <div key={i} className="h-64 bg-white/5 rounded-sm" />)}
        </div>
      ) : (
        <div className="space-y-16">
          {data?.posts?.map(post => (
            <article key={post.id} className="group border-b border-white/10 pb-16">
              {post.imageUrl && (
                <div className="aspect-[21/9] w-full bg-black mb-8 overflow-hidden rounded-sm border border-white/5">
                  <img src={post.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm text-primary font-bold uppercase tracking-wider mb-4">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              
              <h2 className="font-display text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                <Link href={`/news/${post.slug}`}>{post.title}</Link>
              </h2>
              
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                {post.excerpt || post.content.substring(0, 150) + "..."}
              </p>
              
              <Link href={`/news/${post.slug}`} className="inline-flex items-center text-white font-bold tracking-widest uppercase text-sm border-b border-transparent hover:border-white transition-colors pb-1">
                Read Full Entry <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
