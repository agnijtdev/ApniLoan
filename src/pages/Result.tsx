import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/Card';
import Button from '@/components/Button';
import { getResult, downloadResultPDF } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import {
  Download,
  CheckCircle,
  XCircle,
  FileText,
  IndianRupee,
  Calendar,
  CreditCard,
  BarChart3,
  MessageSquare,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoanResult {
  status: 'approved' | 'rejected';
  loanAmount: number;
  tenure: number;
  emi: number;
  creditScore: number;
  notes: string;
  interestRate?: number;
  processingFee?: number;
}

// Mock data for demo
const mockApprovedResult: LoanResult = {
  status: 'approved',
  loanAmount: 500000,
  tenure: 36,
  emi: 16134,
  creditScore: 750,
  notes: 'Congratulations! Your loan application has been approved based on your excellent credit history and stable income. The loan amount will be disbursed to your registered bank account within 2-3 business days after document verification.',
  interestRate: 12.5,
  processingFee: 5000,
};

const Result = () => {
  const { user } = useAuth();
  const [result, setResult] = useState<LoanResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        if (user?.id) {
          const data = await getResult(user.id);
          setResult(data);
        }
      } catch {
        // Use mock data for demo
        setResult(mockApprovedResult);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [user?.id]);

  const handleDownloadPDF = async () => {
    if (!user?.id) return;

    setIsDownloading(true);
    try {
      const blob = await downloadResultPDF(user.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `loan-${result?.status === 'approved' ? 'sanction' : 'rejection'}-letter.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Download started',
        description: 'Your letter is being downloaded.',
      });
    } catch {
      // Mock download for demo
      toast({
        title: 'Download ready',
        description: 'In production, the PDF would be downloaded here.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your result...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-muted">
        <Card className="max-w-md text-center p-8">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Result Found</h2>
          <p className="text-muted-foreground mb-6">
            It looks like you haven't completed a loan application yet.
          </p>
          <Link to="/chat">
            <Button variant="primary">Start Application</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isApproved = result.status === 'approved';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="max-w-2xl mx-auto">
          {/* Status Card */}
          <Card variant="elevated" className="overflow-hidden mb-6">
            <div
              className={cn(
                'py-8 px-6 text-center',
                isApproved ? 'bg-success' : 'bg-destructive'
              )}
            >
              <div className="flex justify-center mb-4">
                {isApproved ? (
                  <CheckCircle className="w-16 h-16 text-success-foreground" />
                ) : (
                  <XCircle className="w-16 h-16 text-destructive-foreground" />
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-success-foreground mb-2">
                {isApproved ? 'Congratulations!' : 'Application Not Approved'}
              </h1>
              <p className="text-success-foreground/90">
                {isApproved
                  ? 'Your loan has been approved'
                  : 'Unfortunately, we could not approve your application'}
              </p>
            </div>
          </Card>

          {/* Details Card */}
          <Card variant="elevated" className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-bold text-foreground">Loan Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <IndianRupee className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="text-lg font-semibold">₹{result.loanAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tenure</p>
                    <p className="text-lg font-semibold">{result.tenure} months</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly EMI</p>
                    <p className="text-lg font-semibold">₹{result.emi.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Credit Score</p>
                    <p className="text-lg font-semibold">{result.creditScore}</p>
                  </div>
                </div>
              </div>

              {result.interestRate && (
                <div className="flex justify-between items-center py-3 border-t border-border">
                  <span className="text-muted-foreground">Interest Rate</span>
                  <span className="font-semibold">{result.interestRate}% p.a.</span>
                </div>
              )}

              {result.processingFee && (
                <div className="flex justify-between items-center py-3 border-t border-border">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-semibold">₹{result.processingFee.toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card variant="elevated" className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Underwriter Notes</h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{result.notes}</p>
            </CardContent>
          </Card>

          {/* Download Button */}
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownloadPDF}
              isLoading={isDownloading}
              className="gap-2"
            >
              <Download className="w-5 h-5" />
              Download {isApproved ? 'Sanction' : 'Rejection'} Letter (PDF)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
