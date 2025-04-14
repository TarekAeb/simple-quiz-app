
import React from 'react';
import { PresentationProvider } from '@/context/PresentationContext';
import { usePresentation } from '@/context/PresentationContext';
import PresentationMain from '@/components/PresentationMain';
import LoginScreen from '@/components/LoginScreen';

const PresentationWrapper: React.FC = () => {
  const { isAuthenticated } = usePresentation();
  
  return (
    <>
      {!isAuthenticated && <LoginScreen />}
      <PresentationMain />
    </>
  );
};

const Index: React.FC = () => {
  return (
    <PresentationProvider>
      <PresentationWrapper />
    </PresentationProvider>
  );
};

export default Index;
