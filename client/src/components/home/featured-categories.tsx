import { Link } from "wouter";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: "Women's",
    slug: "women",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Men's",
    slug: "men",
    image: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Traditional",
    slug: "traditional",
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  }
];

const FeaturedCategories = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-neutral-800 text-center mb-2">Shop By Category</h2>
        <p className="text-neutral-600 text-center mb-8">Explore our collections curated from local South African designers</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/shop?category=${category.slug}`} className="category-card group">
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={category.image}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" 
                  alt={`${category.name} Clothing`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                  <h3 className="text-white font-medium text-lg">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
