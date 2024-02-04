import Redux from './redux';
import Stores from './redux/store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import RenderGame from './containers/RenderGame';

const persistor = persistStore(Stores);

function App() {
  return (
    <Redux.Provider store={Stores}>
      <PersistGate loading={null} persistor={persistor}>
        <RenderGame />
      </PersistGate>
    </Redux.Provider>
  );
}

export default App;
