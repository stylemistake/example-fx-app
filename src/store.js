import { combineReducers, configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { exchangeReducer } from './exchange/reducers';
import { exchangeSaga } from './exchange/sagas';
import { pocketReducer } from './pocket/reducers';

export { Provider } from 'react-redux';

const rootReducer = combineReducers({
  pocket: pocketReducer,
  exchange: exchangeReducer,
});

const rootSaga = function* () {
  console.log('Hello saga!');
  yield all([
    exchangeSaga(),
  ]);
};

export const createStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: rootReducer,
    middleware: [
      sagaMiddleware,
    ],
  });
  sagaMiddleware.run(rootSaga);
  return store;
};
