import { createContext, useContext, useState, ReactNode } from 'react';

interface BookingContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const BookingContext = createContext<BookingContextValue>({ isOpen: false, open: () => {}, close: () => {} });

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <BookingContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
