import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { signupUser } from '@/utils/api';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, Shield } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    age: '',
    income: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.age) newErrors.age = 'Age is required';
    else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) newErrors.age = 'Age must be between 18 and 100';
    if (!formData.income) newErrors.income = 'Income is required';
    else if (parseInt(formData.income) <= 0) newErrors.income = 'Enter a valid income';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signupUser({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        age: parseInt(formData.age),
        income: parseInt(formData.income),
        password: formData.password,
      });

      toast({
        title: 'Account created successfully!',
        description: 'Please login to continue.',
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Signup failed',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center ml-[-18px]">
              <span className="text-primary-foreground font-bold text-xl">L</span>
            </div>
            <span className="font-bold text-2xl text-foreground">ApniLoan</span>
          </Link>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <h1 className="text-2xl font-bold text-foreground">Create an Account</h1>
            <p className="text-muted-foreground mt-1">Start your loan journey today</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="name"
                name="name"
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />

              <Input
                id="phone"
                name="phone"
                label="Phone Number"
                placeholder="9876543210"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />

              <Input
                id="location"
                name="location"
                label="Location"
                placeholder="Mumbai, Maharashtra"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="age"
                  name="age"
                  label="Age"
                  placeholder="25"
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  error={errors.age}
                />

                <Input
                  id="income"
                  name="income"
                  label="Annual Income (₹)"
                  placeholder="500000"
                  type="number"
                  min="0"
                  value={formData.income}
                  onChange={handleChange}
                  error={errors.income}
                />
              </div>

              <Input
                id="password"
                name="password"
                label="Password"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />

              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="••••••••"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Your data is secure with us</span>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-foreground hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
