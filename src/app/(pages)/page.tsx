
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rocket, Palette, BrainCircuit, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Rocket className="h-10 w-10 text-primary" />,
      title: 'Modern Stack',
      description: 'Built with the latest technologies like Next.js and React for a fast, server-first experience.',
    },
    {
      icon: <Palette className="h-10 w-10 text-primary" />,
      title: 'Sleek UI',
      description: 'Professionally designed UI using ShadCN and Tailwind CSS for a beautiful and responsive interface.',
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: 'AI-Powered',
      description: 'Integrated with Genkit to easily add powerful generative AI features to your application.',
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height)-var(--footer-height))]">
      {/* Hero Section */}
      <section 
        className="relative flex-grow flex items-center justify-center text-center p-4 sm:p-8 bg-cover bg-center"
      >
        <div 
          className="absolute inset-0 bg-background/90 bg-cover bg-center"
          style={{ backgroundImage: "url('https://placehold.co/1200x800.png')" }}
          data-ai-hint="abstract technology background"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground">
            Build Your Next Great Idea
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            This is your starting point for a powerful, modern, and AI-enhanced web application. Launch your project in minutes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/auth/signup">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Why Choose This Starter?</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              We've combined the best tools so you can focus on what matters: building your product.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center bg-card/50 hover:bg-card hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4 font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Ready to Start Building?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Create an account and start bringing your vision to life today. No credit card required.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/auth/signup">
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
