import { createReducer } from '@reduxjs/toolkit';
import { round } from '../common/math';
import { commitExchange } from '../exchange/actions';

const createPocket = (symbol, balance = 0) => ({
  symbol,
  balance,
});

const initialState = {
  symbols: ['EUR', 'USD', 'GBP'],
  bySymbol: {
    EUR: createPocket('EUR', 1000),
    USD: createPocket('USD', 0),
    GBP: createPocket('GBP', 0),
  },
};

export const pocketReducer = createReducer(initialState, {
  [commitExchange]: (state, { payload }) => {
    const pocketFrom = state.bySymbol[payload.fromSymbol];
    const pocketTo = state.bySymbol[payload.toSymbol];
    pocketFrom.balance = round(pocketFrom.balance - payload.fromAmount, 2);
    pocketTo.balance = round(pocketTo.balance + payload.toAmount, 2);
  },
});
