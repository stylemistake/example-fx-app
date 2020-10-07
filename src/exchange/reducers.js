import { createReducer } from '@reduxjs/toolkit';
import { commitExchange, updateInputs, updateRates } from './actions';

const initialState = {
  ready: false,
  base: 'EUR',
  rate: undefined,
  rates: {},
  fromSymbol: 'EUR',
  fromAmount: undefined,
  toSymbol: 'USD',
  toAmount: undefined,
};

const getConvertedAmount = state => (
  state.fromAmount * state.rate
);

const tryUpdateAmount = (state, propName, amount) => {
  if (Number.isFinite(amount)) {
    state[propName] = amount;
  }
  else {
    state.error = true;
  }
};

const tryUpdateRate = state => {
  const { base, rates, fromSymbol, toSymbol } = state;
  const fromRate = base === fromSymbol ? 1 : rates[fromSymbol];
  const toRate = base === toSymbol ? 1 : rates[toSymbol];
  state.rate = 1 / fromRate * toRate;
};

export const exchangeReducer = createReducer(initialState, {
  [updateRates]: (state, { payload }) => {
    state.ready = true;
    state.base = payload.base;
    state.rates = payload.rates;
    tryUpdateRate(state);
    tryUpdateAmount(state, 'toAmount', getConvertedAmount(state));
  },
  [updateInputs]: (state, { payload }) => {
    Object.assign(state, payload);
    tryUpdateRate(state);
    // Calculate in normal direction
    if (payload.fromSymbol !== undefined
        || payload.fromAmount !== undefined
        || payload.toSymbol !== undefined) {
      tryUpdateAmount(state, 'toAmount', getConvertedAmount(state));
    }
    // Calculate in reverse direction
    else if (payload.toAmount !== undefined) {
      tryUpdateAmount(state, 'fromAmount', getConvertedAmount({
        ...state,
        fromSymbol: state.toSymbol,
        fromAmount: state.toAmount,
        toSymbol: state.fromSymbol,
      }));
    }
  },
  [commitExchange]: (state, { payload }) => {
    state.fromAmount = undefined;
    state.toAmount = undefined;
  },
});
