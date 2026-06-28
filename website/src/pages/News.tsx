import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Calendar, ArrowLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { POSTS, type Post } from "@/data/news";
import { cn } from "@/lib/utils";

const CATS = ["All", "Academy news", "Match reports", "Community", "Sponsors"] as const;

function PostCard({ post, i }: { post: Post; i: number }) {
  return (
    <Reveal delay={i % 3}>
      <Link
        to={`/news/${post.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-xl"
      >
        <div className="overflow-hidden">
          <img
            src={post.img}
            alt={post.title}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
            <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Calendar className="size-3.5" /> {post.date}
            </span>
          </div>
          <h3 className="mt-4 text-xl leading-snug text-foreground">{post.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
          <span className="mt-auto pt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Read more{" "}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function News() {
  usePageMeta({
    title: "News & Updates",
    description:
      "Latest news, match reports, achievements, and announcements from Golden Knights Soccer Academy in Midrand.",
    path: "/news",
  });
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const shown = cat === "All" ? POSTS : POSTS.filter((p) => p.category === cat);
  return (
    <>
      <PageHero
        eyebrow="News & updates"
        title={
          <>
            From the <span className="text-primary">academy</span>
          </>
        }
      />

      <section className="bg-background py-16 sm:py-20">
        <div className="container-gk">
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                  cat === c
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <PostCard key={p.slug + i} post={p} i={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function NewsPost() {
  const { slug } = useParams();
  const post = POSTS.find((p) => p.slug === slug);

  usePageMeta(
    post
      ? {
          title: post.title,
          description: post.excerpt,
          path: `/news/${post.slug}`,
          image: `https://goldenknightsfc.valosystems.co.za${post.img}`,
        }
      : { title: "Post not found", description: "", path: "/news" }
  );

  if (!post) {
    return (
      <section className="container-gk py-40 text-center">
        <h1 className="text-3xl">Post not found</h1>
        <Button asChild className="mt-6">
          <Link to="/news">Back to news</Link>
        </Button>
      </section>
    );
  }

  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <article className="bg-background pt-32 pb-20 sm:pt-40">
        <div className="container-gk max-w-3xl">
          <Link
            to="/news"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" /> All news
          </Link>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
            <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Calendar className="size-3.5" /> {post.date}
            </span>
          </div>
          <h1 className="mt-4 font-heading text-4xl font-black leading-[1.05] text-foreground text-balance sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-8 overflow-hidden rounded-3xl">
            <img src={post.img} alt={post.title} loading="lazy" className="aspect-[16/9] w-full object-cover" />
          </div>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
            {post.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-secondary p-8 text-center">
            <h3 className="text-2xl text-foreground">Be part of the academy</h3>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/register">
                  Join the Academy <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/sponsors">Become a Sponsor</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>

      <section className="bg-background pb-24">
        <div className="container-gk">
          <h2 className="text-2xl text-foreground">More news</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {more.map((p, i) => (
              <PostCard key={p.slug} post={p} i={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
