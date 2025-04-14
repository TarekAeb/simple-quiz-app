
import React, { useState } from 'react';
import { usePresentation } from '@/context/PresentationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { authenticate } = usePresentation();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for better UX
    setTimeout(() => {
      const isValid = authenticate(password);
      setIsLoading(false);

      if (!isValid) {
        setError('Invalid password. Please try again.');
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Please check your password and try again.",
        });
      } else {
        toast({
          title: "Authentication successful",
          description: "Welcome to the April 16 celebration presentation.",
        });
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg algeria-pattern">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-algeria-green text-white flex items-center justify-center text-2xl font-semibold">
            16
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-algeria-green">
          April 16 Celebration
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Admin Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`w-full border-2 ${error ? 'border-algeria-red' : 'border-algeria-green'}`}
              required
            />
            {error && <p className="text-sm text-algeria-red">{error}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-algeria-green hover:bg-opacity-90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Access restricted to presentation administrators.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
