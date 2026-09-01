import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface WaitlistContextValue {
  isOpen: boolean;
  source: string;
  presetInterest: string;
  open: (source?: string, interest?: string) => void;
  close: () => void;
}

const WaitlistContext = createContext<WaitlistContextValue>({
  isOpen: false, source: 'unknown', presetInterest: '',
  open: () => {}, close: () => {},
});

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState('unknown');
  const [presetInterest, setPresetInterest] = useState('');

  const open = (src = 'unknown', interest = '') => {
    setSource(src);
    setPresetInterest(interest);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return (
    <WaitlistContext.Provider value={{ isOpen, source, presetInterest, open, close }}>
      {children}
    </WaitlistContext.Provider>
  );
}

export const useWaitlist = () => useContext(WaitlistContext);
