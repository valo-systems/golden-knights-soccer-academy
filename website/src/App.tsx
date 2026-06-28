import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Programmes } from "@/pages/Programmes";
import { Sponsors } from "@/pages/Sponsors";
import { Contact } from "@/pages/Contact";
import { Teams } from "@/pages/Teams";
import { Gallery } from "@/pages/Gallery";
import { News, NewsPost } from "@/pages/News";
import { Register } from "@/pages/Register";
import { Shop } from "@/pages/Shop";
import { Product } from "@/pages/Product";
import { Checkout } from "@/pages/Checkout";
import { Placeholder } from "@/pages/Placeholder";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programmes" element={<Programmes />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsPost />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:slug" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Placeholder title="Page not found" />} />
      </Route>
    </Routes>
  );
}
