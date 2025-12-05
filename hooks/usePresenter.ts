import { useContext } from 'react';
import { PresenterContext } from '../contexts/PresenterContext';
import { AppPresenter } from '../presenters/AppPresenter';

export const usePresenter = (): AppPresenter => {
  const context = useContext(PresenterContext);
  if (!context) {
    throw new Error('usePresenter must be used within a PresenterProvider');
  }
  return context;
};
