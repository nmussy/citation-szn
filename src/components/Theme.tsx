import {createContext} from 'preact';

export type ThemeType = 'dark' | 'light';
export const Theme = createContext<ThemeType>('dark');
