import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { loginUser } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, Phone, Lock } from 'lucide-react';
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    //login bypass for testing (remove it after implemnting backend)
  login("dummy-token", { name: "Test User", phone: formData.phone });
  navigate(from, { replace: true });
  return;

  // (delete unitl here after implementing backend)


    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await loginUser({
        phone: formData.phone,
        password: formData.password
      });
      login(response.token, response.user);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.'
      });
      navigate(from, {
        replace: true
      });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            
            
          </Link>
        </div>

        <Card variant="elevated" className="py-12">
          <CardHeader>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-1">Login to access your dashboard</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Input id="phone" name="phone" label="Phone Number" placeholder="9876543210" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} />
                <Phone className="absolute right-3 top-[38px] w-5 h-5 text-muted-foreground" />
              </div>

              <div className="relative">
                <Input id="password" name="password" label="Password" placeholder="••••••••" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
                <Lock className="absolute right-3 top-[38px] w-5 h-5 text-muted-foreground" />
              </div>

              <Button type="submit" variant="secondary" className="w-full" isLoading={isLoading}>
                Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-foreground hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Login;