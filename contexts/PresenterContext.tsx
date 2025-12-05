import React, { createContext, ReactNode } from 'react';
import { AppPresenter } from '../presenters/AppPresenter';

const PresenterContext = createContext<AppPresenter | null>(null);

export const PresenterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // We use a ref to ensure the presenter is a singleton that persists across renders
  const presenterRef = React.useRef<AppPresenter>(new AppPresenter());

  return (
    <PresenterContext.Provider value={presenterRef.current}>
      {children}
    </PresenterContext.Provider>
  );
};

export const PresenterContextConsumer = PresenterContext.Consumer;
export { PresenterContext };
