import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface WaitlistContextValue {
  isOpen: boolean;
  source: string;
  open: (source?: string) => void;
  close: () => void;
}

const WaitlistContext = createContext<WaitlistContextValue>({
  isOpen: false, source: 'unknown',
  open: () => {}, close: () => {},
});

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState('unknown');

  const open = (src = 'unknown') => { setSource(src); setIsOpen(true); };
  const close = () => setIsOpen(false);

  return (
    <WaitlistContext.Provider value={{ isOpen, source, open, close }}>
      {children}
    </WaitlistContext.Provider>
  );
}

export const useWaitlist = () => useContext(WaitlistContext);
