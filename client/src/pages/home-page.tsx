import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import FeaturedCategories from "@/components/home/featured-categories";
import FeaturedProducts from "@/components/home/featured-products";
import FeaturedBrands from "@/components/home/featured-brands";
import SellerCTA from "@/components/home/seller-cta";
import CustomerReviews from "@/components/home/customer-reviews";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>LocalThreads Marketplace | South African Clothing Brands</title>
        <meta name="description" content="Discover authentic South African clothing brands on LocalThreads Marketplace. Shop traditional wear, urban fashion, and handcrafted accessories from local designers." />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&family=Nunito+Sans:wght@300;400;600;700&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <Hero />
          <FeaturedCategories />
          <FeaturedProducts />
          <FeaturedBrands />
          <SellerCTA />
          <CustomerReviews />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
