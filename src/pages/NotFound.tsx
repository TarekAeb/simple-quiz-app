
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <AlertTriangle className="w-16 h-16 text-algeria-red mb-4" />
      <h1 className="text-4xl font-bold text-algeria-green mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-6">Page not found</p>
      <Button 
        asChild
        className="bg-algeria-green hover:bg-opacity-90"
      >
        <a href="/">Return to Presentation</a>
      </Button>
    </div>
  );
};

export default NotFound;
