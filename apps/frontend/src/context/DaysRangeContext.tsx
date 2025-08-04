import { createContext, ReactNode, useContext, useState } from 'react';

interface DaysRangeContextType {
  daysRange: number;
  setDaysRange: (days: number) => void;
}

const DaysRangeContext = createContext<DaysRangeContextType | undefined>(undefined);

export function DaysRangeProvider({ children }: { children: ReactNode }) {
  const [daysRange, setDaysRange] = useState<number>(30);

  return (
    <DaysRangeContext.Provider value={{ daysRange, setDaysRange }}>
      {children}
    </DaysRangeContext.Provider>
  );
}

export function useDaysRange() {
  const context = useContext(DaysRangeContext);
  if (context === undefined) {
    throw new Error('useDaysRange must be used within a DaysRangeProvider');
  }
  return context;
}
