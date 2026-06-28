import { useEffect } from "react";

const SITE_NAME = "Golden Knights Soccer Academy";
const BASE_URL = "https://goldenknightsfc.valosystems.co.za";
const DEFAULT_IMAGE = `${BASE_URL}/img/og-image.png`;

export function usePageMeta({
  title,
  description,
  path = "",
  image = DEFAULT_IMAGE,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const canonical = `${BASE_URL}${path}`;

    document.title = fullTitle;
    setMeta("name", "description", description);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", SITE_NAME);

    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    setLink("canonical", canonical);

    return () => {
      document.title = `${SITE_NAME} | Youth Football in Midrand`;
    };
  }, [title, description, path, image]);
}

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
