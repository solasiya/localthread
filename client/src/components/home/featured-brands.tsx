import { Link } from "wouter";

interface Brand {
  id: number;
  name: string;
  initials: string;
  slug: string;
  bgColor: string;
}

const brands: Brand[] = [
  {
    id: 1,
    name: "Zulu Threads",
    initials: "ZT",
    slug: "zulu-threads",
    bgColor: "bg-primary"
  },
  {
    id: 2,
    name: "Cape Town Couture",
    initials: "CC",
    slug: "cape-town-couture",
    bgColor: "bg-secondary"
  },
  {
    id: 3,
    name: "Ndebele Crafts",
    initials: "NC",
    slug: "ndebele-crafts",
    bgColor: "bg-accent"
  },
  {
    id: 4,
    name: "Durban Design Co.",
    initials: "DD",
    slug: "durban-design",
    bgColor: "bg-primary-light"
  },
  {
    id: 5,
    name: "Soweto Fashion",
    initials: "SF",
    slug: "soweto-fashion",
    bgColor: "bg-secondary-light"
  },
  {
    id: 6,
    name: "Joburg Boutique",
    initials: "JB",
    slug: "joburg-boutique",
    bgColor: "bg-accent-light"
  }
];

const FeaturedBrands = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-neutral-800 text-center mb-2">Featured Brands</h2>
        <p className="text-neutral-600 text-center mb-8">Discover authentic South African clothing brands</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link key={brand.id} href={`/shop?brand=${brand.slug}`} className="bg-neutral-100 p-6 rounded-lg flex items-center justify-center hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto ${brand.bgColor} rounded-full flex items-center justify-center text-white mb-2`}>
                  <span className="font-bold">{brand.initials}</span>
                </div>
                <p className="font-medium text-neutral-800">{brand.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;
