'use client';

import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} className="gap-2">
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  );
}