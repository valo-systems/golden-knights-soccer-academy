import { useState } from "react";
import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  red: "bg-[linear-gradient(135deg,#ee3030,#b41f1f)]",
  dark: "bg-[linear-gradient(135deg,#1f2128,#0c0d10)]",
  light: "bg-[linear-gradient(135deg,#ffffff,#ededf0)]",
};

function BrandedFallback({ tone }: { tone: "red" | "dark" | "light" }) {
  return (
    <>
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-10" />
      {tone === "light" ? (
        <div className="flex aspect-square w-2/5 max-w-[130px] items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#ee3030,#b41f1f)]">
          <img src="/img/logo/gksa-white.png" alt="" aria-hidden className="w-3/5" />
        </div>
      ) : (
        <img
          src="/img/logo/gksa-white.png"
          alt=""
          aria-hidden
          className="w-2/5 max-w-[120px] opacity-95"
        />
      )}
    </>
  );
}

export function ProductTile({
  tone,
  photo,
  alt = "",
  className,
}: {
  tone: "red" | "dark" | "light";
  photo?: string;
  alt?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showPhoto = photo && !failed;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        TONES[tone],
        className
      )}
    >
      {showPhoto ? (
        <img
          src={photo}
          alt={alt}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <BrandedFallback tone={tone} />
      )}
    </div>
  );
}
