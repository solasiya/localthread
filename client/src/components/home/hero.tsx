import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Hero = () => {
  return (
    <section className="hero-pattern bg-white pt-6 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 flex flex-col justify-center pr-0 md:pr-12 mb-8 md:mb-0">
            <h2 className="font-accent text-4xl md:text-5xl font-bold text-secondary mb-4">
              Discover <span className="text-primary">Local</span> Fashion Treasures
            </h2>
            <p className="text-neutral-600 text-lg mb-8">
              Explore the best South African clothing brands, supporting local talent and sustainable fashion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-secondary text-secondary hover:bg-secondary hover:text-white text-base">
                <Link href="/auth?role=seller">Become a Seller</Link>
              </Button>
            </div>
            <div className="flex items-center mt-8">
              <div className="flex -space-x-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Customer" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Customer" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Customer" />
                  <AvatarFallback>JW</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-4">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-500 text-sm">Over 2,000 happy customers</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                className="w-full h-auto rounded-lg shadow-xl" 
                alt="South African clothing brand showcase" 
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="text-primary font-bold">100+ Local Brands</p>
                <p className="text-sm text-neutral-600">Supporting SA Economy</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-accent p-4 rounded-full shadow-lg hidden md:flex items-center justify-center">
                <p className="text-secondary font-bold text-xl">30%<br /><span className="text-sm">OFF</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
