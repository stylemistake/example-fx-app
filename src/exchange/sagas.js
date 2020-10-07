import axios from 'axios';
import { call, put, delay } from 'redux-saga/effects';
import { updateRates } from './actions';

const RATES_CHECK_INTERVAL = 10000;
const RATES_URL = 'https://api.openrates.io/latest';

export const exchangeSaga = function* () {
  // Periodically fetch rates
  while (true) {
    yield call(fetchRatesSaga);
    yield delay(RATES_CHECK_INTERVAL);
  }
};

const fetchRatesSaga = function* () {
  const res = yield call(axios.get, RATES_URL);
  yield put(updateRates(res.data));
};
