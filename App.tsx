import React from 'react';
import { PresenterProvider } from './contexts/PresenterContext';
import GameScreen from './components/business/GameScreen';

const App: React.FC = () => {
  return (
    <PresenterProvider>
      <GameScreen />
    </PresenterProvider>
  );
};

export default App;
