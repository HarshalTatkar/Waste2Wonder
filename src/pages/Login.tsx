import React from 'react';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';

interface LoginProps {
  onSuccess: () => void;
  onNavigateToSignup: () => void;
  onNavigateHome: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onSuccess,
  onNavigateToSignup,
  onNavigateHome,
}) => {
  return (
    <AuthLayout onHomeClick={onNavigateHome}>
      <LoginForm
        onSuccess={onSuccess}
        onSwitchToSignup={onNavigateToSignup}
      />
    </AuthLayout>
  );
};
