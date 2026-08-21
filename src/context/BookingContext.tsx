import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface BookingContextValue {
  isOpen: boolean;
  isMounted: boolean;
  open: () => void;
  close: () => void;
  mount: () => void;
}

const BookingContext = createContext<BookingContextValue>({
  isOpen: false, isMounted: false,
  open: () => {}, close: () => {}, mount: () => {},
});

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const mount = () => setIsMounted(true);
  const open = () => { setIsMounted(true); setIsOpen(true); };
  return (
    <BookingContext.Provider value={{ isOpen, isMounted, open, close: () => setIsOpen(false), mount }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
