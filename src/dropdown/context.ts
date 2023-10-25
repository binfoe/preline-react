import { createContext } from 'react';

export const DropdownContext = createContext<((evt?: Event) => void) | undefined>(undefined);
