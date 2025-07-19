
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search, ChefHat, ShoppingBag, Utensils, IndianRupee, Pizza, Soup } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';

export default function HomePage() {
  const features = [
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: 'Discover Local Cooks',
      description: 'Find a variety of home cooks and tiffin services in your neighborhood.',
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-primary" />,
      title: 'Order with Ease',
      description: 'Browse menus and place your order for delivery or pickup in just a few clicks.',
    },
    {
      icon: <Utensils className="h-10 w-10 text-primary" />,
      title: 'Enjoy Authentic Meals',
      description: 'Savor the taste of fresh, homemade food prepared with love and care.',
    },
  ];

  const categories = [
    { name: 'North Indian', icon: <IndianRupee className="h-8 w-8" />, dataAiHint: 'indian food' },
    { name: 'Italian', icon: <Pizza className="h-8 w-8" />, dataAiHint: 'pizza' },
    { name: 'South Indian', icon: <Soup className="h-8 w-8" />, dataAiHint: 'dosa' },
    { name: 'Chaat', icon: <Utensils className="h-8 w-8" />, dataAiHint: 'chaat food' },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Delicious food background"
            fill
            className="object-cover"
            priority
            data-ai-hint="delicious food background"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative container mx-auto px-4 py-32 md:py-48 text-center z-10">
          <h1 className="font-headline text-4xl md:text-6xl font-bold">
            Homemade meals, delivered.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Discover authentic flavors from home kitchens near you.
          </p>
          <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-lg shadow-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your delivery address"
                className="pl-10 h-12 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Link href="/dashboard" passHref legacyBehavior>
              <Button asChild size="lg" className="w-full sm:w-auto h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
                <a>Find Food</a>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-background py-16 md:py-24">
        <div className="container">
          <SectionTitle
            title="How TiffinBox Works"
            subtitle="Get your favorite homemade food in 3 simple steps."
            className="text-center"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-4 bg-primary/10 p-4 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="font-headline text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* Categories Section */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container">
          <SectionTitle 
            title="Explore Cuisines"
            subtitle="From comforting classics to exciting new flavors."
            className="text-center"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
            {categories.map((category) => (
               <Link href="/dashboard" key={category.name} className="group" passHref legacyBehavior>
                <a>
                  <div className="relative h-40 w-full overflow-hidden rounded-lg">
                      <Image 
                          src={`https://placehold.co/300x300.png`}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          data-ai-hint={category.dataAiHint}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="text-center text-white">
                            {category.icon}
                            <h3 className="font-headline text-lg font-semibold mt-1">{category.name}</h3>
                          </div>
                      </div>
                  </div>
                  </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seller CTA Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden md:flex items-center">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Are you a Home Cook?</h2>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Join our community of passionate cooks, share your delicious creations, and earn from your kitchen.
              </p>
              <div className="mt-8">
                <Link href="/auth/signup?type=seller" passHref legacyBehavior>
                    <Button asChild size="lg">
                      <a>
                        Become a Seller
                        <ChefHat className="ml-2 h-5 w-5" />
                      </a>
                    </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto relative">
                <Image 
                    src="https://placehold.co/600x400.png"
                    alt="A person cooking in a kitchen"
                    fill
                    className="object-cover"
                    data-ai-hint="person cooking"
                />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
