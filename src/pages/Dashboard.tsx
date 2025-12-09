import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/Card';
import Button from '@/components/Button';
import { getLoans, getReviews } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle, Star, TrendingUp, Clock, Percent, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Loan {
  id: string;
  type: string;
  interestRate: string;
  eligibility: string;
  tenure: string;
  description?: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  review: string;
  avatar?: string;
}

// Mock data for demo
const mockLoans: Loan[] = [
  { id: '1', type: 'Personal Loan', interestRate: '10.5% - 18%', eligibility: 'Min income ₹25,000/month', tenure: '1 - 5 years', description: 'Quick disbursement for personal needs' },
  { id: '2', type: 'Home Loan', interestRate: '8.5% - 11%', eligibility: 'Min income ₹30,000/month', tenure: '5 - 30 years', description: 'Make your dream home a reality' },
  { id: '3', type: 'Car Loan', interestRate: '9% - 14%', eligibility: 'Min income ₹20,000/month', tenure: '1 - 7 years', description: 'Drive your dream car today' },
  { id: '4', type: 'Education Loan', interestRate: '7% - 12%', eligibility: 'Admission confirmed', tenure: '5 - 15 years', description: 'Invest in your future' },
  { id: '5', type: 'Business Loan', interestRate: '11% - 20%', eligibility: 'Min turnover ₹10L/year', tenure: '1 - 5 years', description: 'Grow your business with ease' },
  { id: '6', type: 'Gold Loan', interestRate: '8% - 13%', eligibility: 'Min gold value ₹25,000', tenure: '3 months - 3 years', description: 'Quick funds against gold' },
];

const mockReviews: Review[] = [
  { id: '1', name: 'Rahul Sharma', rating: 5, review: 'Amazing experience! Got my loan approved within 24 hours. The AI advisor was super helpful.' },
  { id: '2', name: 'Priya Patel', rating: 4, review: 'Very smooth process. The chat feature made it easy to understand my options.' },
  { id: '3', name: 'Amit Kumar', rating: 5, review: 'Best loan platform I have used. Transparent rates and quick disbursement.' },
  { id: '4', name: 'Sneha Reddy', rating: 5, review: 'The AI agent explained everything clearly. Got approved for a home loan at a great rate!' },
  { id: '5', name: 'Vikram Singh', rating: 4, review: 'Simple interface, quick approval. Highly recommended for anyone looking for loans.' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loansData = await getLoans();
        setLoans(loansData);
      } catch {
        setLoans(mockLoans);
      } finally {
        setIsLoadingLoans(false);
      }

      try {
        const reviewsData = await getReviews();
        setReviews(reviewsData);
      } catch {
        setReviews(mockReviews);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchData();
  }, []);

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const displayedLoans = loans.length > 0 ? loans : mockLoans;
  const displayedReviews = reviews.length > 0 ? reviews : mockReviews;

  return (
    <div className="min-h-screen bg-muted">
      {/* Hero Section */}
      <section className="bg-accent text-accent-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome back, <span className="text-primary">{user?.name || 'User'}</span>
            </h1>
            <p className="text-lg text-accent-foreground/80 mb-8">
              Explore our loan options and chat with our AI advisor to find the perfect loan for you.
            </p>
            <Link to="/chat">
              <Button variant="primary" size="lg" className="gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat with AI Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Loan Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Loan Categories</h2>
          </div>

          {isLoadingLoans ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedLoans.map((loan) => (
                <Card key={loan.id} variant="elevated" className="overflow-hidden hover:card-shadow-hover transition-shadow">
                  <CardHeader accent className="flex flex-row items-center gap-3">
                    <TrendingUp className="w-5 h-5" />
                    <h3 className="font-bold text-lg">{loan.type}</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loan.description && (
                      <p className="text-muted-foreground text-sm">{loan.description}</p>
                    )}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Interest Rate:</span>
                        <span className="text-sm text-muted-foreground">{loan.interestRate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Eligibility:</span>
                        <span className="text-sm text-muted-foreground">{loan.eligibility}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Tenure:</span>
                        <span className="text-sm text-muted-foreground">{loan.tenure}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">What Our Users Say</h2>
          </div>

          {isLoadingReviews ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="relative max-w-3xl mx-auto">
              <Card variant="elevated" className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      {displayedReviews[currentReviewIndex]?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {displayedReviews[currentReviewIndex]?.name}
                    </h4>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'w-4 h-4',
                            i < displayedReviews[currentReviewIndex]?.rating
                              ? 'text-primary fill-primary'
                              : 'text-muted-foreground'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-foreground text-lg italic">
                  "{displayedReviews[currentReviewIndex]?.review}"
                </p>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevReview}
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {displayedReviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReviewIndex(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-colors',
                        index === currentReviewIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                      )}
                    />
                  ))}
                </div>
                <button
                  onClick={nextReview}
                  className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-accent text-accent-foreground rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Ready to Get Your Loan?
            </h2>
            <p className="text-lg text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
              Our AI advisor will guide you through the entire process, from eligibility check to loan approval.
            </p>
            <Link to="/chat">
              <Button variant="primary" size="lg" className="text-lg px-12 py-6">
                <MessageCircle className="w-6 h-6 mr-3" />
                CHAT WITH AI ADVISOR
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
