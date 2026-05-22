/**
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AppLogo({ className = '', size = 'md' }: AppLogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`font-cubao italic flex items-center justify-center leading-none tracking-tighter ${sizeClasses[size]} ${className}`}>
      <span className="text-white">P</span>
      <span className="text-brand-blue -ml-1">H</span>
    </div>
  );
}
