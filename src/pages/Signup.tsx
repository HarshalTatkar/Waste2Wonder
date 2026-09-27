import React from 'react';
import { AuthLayout } from '../layouts/AuthLayout';
import { SignupForm } from '../components/auth/SignupForm';

interface SignupProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
  onNavigateHome: () => void;
}

export const Signup: React.FC<SignupProps> = ({
  onSuccess,
  onNavigateToLogin,
  onNavigateHome,
}) => {
  return (
    <AuthLayout onHomeClick={onNavigateHome}>
      <SignupForm
        onSuccess={onSuccess}
        onSwitchToLogin={onNavigateToLogin}
      />
    </AuthLayout>
  );
};
