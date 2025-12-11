import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Shield, Zap, MessageCircle, TrendingUp, CheckCircle, Star } from 'lucide-react';
const Index = () => {
  const {
    isAuthenticated
  } = useAuth();
  const features = [{
    icon: Zap,
    title: 'Instant Approval',
    description: 'Get your loan approved in minutes with our AI-powered system.'
  }, {
    icon: MessageCircle,
    title: 'AI Advisor',
    description: 'Chat with our intelligent advisor to find the perfect loan for you.'
  }, {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected with bank-level security.'
  }, {
    icon: TrendingUp,
    title: 'Best Rates',
    description: 'Competitive interest rates starting from just 7% p.a.'
  }];
  const steps = [{
    number: '01',
    title: 'Sign Up',
    description: 'Create your account in seconds'
  }, {
    number: '02',
    title: 'Chat with AI',
    description: 'Tell us about your loan needs'
  }, {
    number: '03',
    title: 'Get Approved',
    description: 'Receive instant decision'
  }, {
    number: '04',
    title: 'Get Funds',
    description: 'Money in your account'
  }];
  return <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                {/* <span className="text-primary-foreground font-bold text-lg">L</span> */}
                <img src="./public/favicon.ico" alt="ApniLoan Logo" className="w-10 h-10" />
              </div>
              <span className="font-bold text-xl">ApniLoan</span>
            </Link>

            <div className="flex items-center gap-3">
              {isAuthenticated ? <Link to="/dashboard">
                  <Button variant="primary" size="sm">
                    Dashboard
                  </Button>
                </Link> : <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-accent-foreground hover:bg-accent-foreground/10">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-accent text-accent-foreground min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            
            
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight "   style={{ wordSpacing: "0.2em" }}   >
              Get Your Loan Approved in{' '}
              <span className="text-primary">Minutes</span>
            </h1>
            
            <p className="text-lg md:text-xl text-accent-foreground/80 mb-8 max-w-2xl mx-auto mt-11">
              Experience the future of lending with our AI-powered platform. 
              Quick approvals, competitive rates, and a seamless experience.
            </p>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-16">
  <Link to={isAuthenticated ? '/chat' : '/login'}>
    <Button
      variant="primary"
      size="lg"
      className="gap-2 w-full sm:w-auto transition-all duration-300 ease-in-out hover:scale-105"
    >
      <MessageCircle className="w-5 h-5" />
      CHAT
      {/* {isAuthenticated ? 'Chat with AI' : 'Get Started Free'} */}
    </Button>
  </Link>
  
  <Link 
  to="/#features"
  onClick={() => {
    setTimeout(() => {
      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }}
>
  <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent">
    Learn More
    <ArrowRight className="w-4 h-4" />
  </Button>
</Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-x-50 gap-y-4 max-w-3xl mx-auto mt-24 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">₹50Cr+</p>
                <p className="text-sm text-accent-foreground/70 mt-1">Loans Disbursed</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">50K+</p>
                <p className="text-sm text-accent-foreground/70 mt-1">Happy Users</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">4.9★</p>
                <p className="text-sm text-accent-foreground/70 mt-1">User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose ApniLoan?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We've reimagined the loan application process to be faster, smarter, and more transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <Card key={index} variant="elevated" className="text-center p-6 hover:card-shadow-hover transition-shadow">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to get your loan approved and funded.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => <div key={index} className="relative">
                <div className="text-6xl font-extrabold mb-4 text-amber-400">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && <ArrowRight className="hidden lg:block absolute top-8 -right-4 w-8 h-8 text-muted-foreground/30" />}
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who got their loans approved instantly.
          </p>
          <Link to={isAuthenticated ? '/chat' : '/signup'}>
            <Button variant="primary" size="lg" className="gap-2">
              <MessageCircle className="w-5 h-5" />
              Start Your Application
            </Button>
          </Link>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-accent-foreground/70">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>100% secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                {/* <span className="text-primary-foreground font-bold text-lg">L</span> */}
                <img src="./public/favicon.ico" alt="ApniLoan Logo" className="w-10 h-10" />
              </div>
              <span className="font-bold text-xl">ApniLoan</span>
            </div>
            <p className="text-background/70 text-sm">© enomade</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;