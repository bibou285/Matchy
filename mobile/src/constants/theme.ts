/**
 * Matchy Design System & Color Tokens
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#251638',
    background: '#F8F5FF',
    backgroundElement: '#EDE4FF',
    backgroundSelected: '#640FCD',
    textSecondary: '#786B88',
    primary: '#640FCD',
    primaryDark: '#4B0A9F',
    border: '#E5DCF2',
  },
  dark: {
    text: '#FFFFFF',
    background: '#1A0E2A',
    backgroundElement: '#2B1B42',
    backgroundSelected: '#640FCD',
    textSecondary: '#C5BBD3',
    primary: '#8B38FF',
    primaryDark: '#640FCD',
    border: '#3D2D54',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
