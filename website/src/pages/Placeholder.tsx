import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-heading";

export function Placeholder({ title }: { title: string }) {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-ink text-white">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="container-gk relative text-center">
        <Eyebrow light className="justify-center">
          Coming next
        </Eyebrow>
        <h1 className="mt-4 text-5xl text-white sm:text-6xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-md text-white/60">
          This page is being built next. We're shipping page by page so you can test each one.
        </p>
        <Button asChild className="mt-8" size="lg">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </section>
  );
}
