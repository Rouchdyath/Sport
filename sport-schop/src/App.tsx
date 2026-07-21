import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ShopPage from "./pages/ShopPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import EbooksPage from "./pages/EbooksPage";
import EbookDetailPage from "./pages/EbookDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MonComptePage from "./pages/MonComptePage";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminProductFormPage from "./pages/admin/AdminProductFormPage";
import AdminEbooksPage from "./pages/admin/AdminEbooksPage";
import AdminEbookFormPage from "./pages/admin/AdminEbookFormPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";

function PublicLayout({ children, hideHeader = false, hideFooter = false }: { children: React.ReactNode; hideHeader?: boolean; hideFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Routes publiques (avec Header/Footer) */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/produit/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
      <Route path="/produits" element={<PublicLayout><ShopPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/panier" element={<PublicLayout><CartPage /></PublicLayout>} />
      <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
      <Route path="/confirmation" element={<PublicLayout><ConfirmationPage /></PublicLayout>} />
      <Route path="/ebooks" element={<PublicLayout><EbooksPage /></PublicLayout>} />
      <Route path="/ebook/:id" element={<PublicLayout><EbookDetailPage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout hideHeader hideFooter><LoginPage /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout hideHeader hideFooter><RegisterPage /></PublicLayout>} />
      <Route path="/mon-compte" element={<PublicLayout><MonComptePage /></PublicLayout>} />
      

      {/* Routes admin (layout séparé, sans Header/Footer du site) */}
      <Route
        path="/admin-dashboard"element={<AdminRoute><AdminLayout /></AdminRoute>} >
        <Route index element={<AdminDashboardPage />} />
        <Route path="produits" element={<AdminProductsPage />} />
        <Route path="produits/nouveau" element={<AdminProductFormPage />} />
        <Route path="produits/:id" element={<AdminProductFormPage />} />
        <Route path="ebooks" element={<AdminEbooksPage />} />
        <Route path="ebooks/nouveau" element={<AdminEbookFormPage />} />
        <Route path="ebooks/:id" element={<AdminEbookFormPage />} />
        <Route path="commandes" element={<AdminOrdersPage />} />
        <Route path="/admin-dashboard/produits" element={<AdminProductsPage />} />
      </Route>
    </Routes>
  );
}