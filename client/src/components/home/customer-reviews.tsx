import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: number;
  rating: number;
  comment: string;
  customerName: string;
  customerLocation: string;
  customerImage: string;
}

const reviews: Review[] = [
  {
    id: 1,
    rating: 5,
    comment: "I love supporting local South African brands through LocalThreads. The quality of clothing is exceptional, and the traditional wear collection is absolutely stunning. My new favorite place to shop!",
    customerName: "Thandi Nkosi",
    customerLocation: "Cape Town",
    customerImage: "https://images.unsplash.com/photo-1554727242-741c14fa561c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 2,
    rating: 5,
    comment: "As a small business owner, joining LocalThreads as a seller has transformed my business. The platform is easy to use, and I've gained customers from all over South Africa. Highly recommend for any local clothing brand!",
    customerName: "Sipho Mbatha",
    customerLocation: "Durban",
    customerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 3,
    rating: 5,
    comment: "The handcrafted accessories I found on LocalThreads are unique and beautiful. Fast delivery, excellent customer service, and I love that I'm supporting South African artisans. Will definitely be shopping here again!",
    customerName: "Lisa van der Merwe",
    customerLocation: "Johannesburg",
    customerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
  }
];

const CustomerReviews = () => {
  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-neutral-800 text-center mb-2">What Our Customers Say</h2>
        <p className="text-neutral-600 text-center mb-12">Trusted by fashion enthusiasts across South Africa</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex text-accent mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-current' : ''}`} />
                ))}
              </div>
              <p className="text-neutral-600 mb-6">{review.comment}</p>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={review.customerImage} alt={review.customerName} />
                  <AvatarFallback>{review.customerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-neutral-800">{review.customerName}</p>
                  <p className="text-sm text-neutral-500">{review.customerLocation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
