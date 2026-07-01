import { Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/admin/auth";
import { AdminProvider } from "@/admin/store";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Programmes } from "@/pages/Programmes";
import { Sponsors } from "@/pages/Sponsors";
import { Contact } from "@/pages/Contact";
import { Teams } from "@/pages/Teams";
import { Fixtures } from "@/pages/Fixtures";
import { Gallery } from "@/pages/Gallery";
import { News, NewsPost } from "@/pages/News";
import { Register } from "@/pages/Register";
import { Shop } from "@/pages/Shop";
import { Product } from "@/pages/Product";
import { Checkout } from "@/pages/Checkout";
import { Placeholder } from "@/pages/Placeholder";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { AdminLogin } from "@/pages/admin/Login";
import { AdminMembers } from "@/pages/admin/Members";
import { AdminOrders } from "@/pages/admin/Orders";
import { AdminProspects } from "@/pages/admin/Prospects";
import { AdminGallery } from "@/pages/admin/Gallery";
import { AdminMatches } from "@/pages/admin/Matches";
import { AdminNews } from "@/pages/admin/News";
import { AdminSettings } from "@/pages/admin/Settings";
import { AdminSponsors } from "@/pages/admin/Sponsors";

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="prospects" element={<AdminProspects />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="renewals" element={<Navigate to="/admin/members" replace />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="matches" element={<AdminMatches />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="sponsors" element={<AdminSponsors />} />
          </Route>

          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programmes" element={<Programmes />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/fixtures" element={<Fixtures />} />
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
      </AdminProvider>
    </AuthProvider>
  );
}
