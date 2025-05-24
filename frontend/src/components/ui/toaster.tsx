'use client';

// This file is kept for compatibility but uses sonner instead of Chakra UI
// The actual Toaster component is now imported directly from sonner in main.tsx

import { toast as sonnerToast } from 'sonner';

// Export a compatible API for existing code
export const toaster = {
  success: (options: { title?: string; description?: string }) => {
    return sonnerToast.success(options.title || '', {
      description: options.description,
    });
  },
  error: (options: { title?: string; description?: string }) => {
    return sonnerToast.error(options.title || '', {
      description: options.description,
    });
  },
  info: (options: { title?: string; description?: string }) => {
    return sonnerToast.info(options.title || '', {
      description: options.description,
    });
  },
  warning: (options: { title?: string; description?: string }) => {
    return sonnerToast.warning(options.title || '', {
      description: options.description,
    });
  },
  loading: (options: { title?: string; description?: string }) => {
    return sonnerToast.loading(options.title || '', {
      description: options.description,
    });
  },
};

// Empty component since we're using the Toaster from sonner directly in main.tsx
export const Toaster = () => null;
