import React from 'react';

// Disabled login dialog - no authentication required for UI demo
interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LoginDialog({ open, onOpenChange, onSuccess }: LoginDialogProps) {
  return null; // Not used in auth-free version
}