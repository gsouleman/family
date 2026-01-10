
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { DataProvider } from '@/contexts/DataContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { AppProvider } from '@/contexts/AppContext';

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <DataProvider>
          <AppProvider>
            <AppLayout />
          </AppProvider>
        </DataProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
};

export default Index;
