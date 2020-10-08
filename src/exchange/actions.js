import { createAction } from '@reduxjs/toolkit';

export const updateRates = createAction('exchange/updateRates');
export const updateInputs = createAction('exchange/updateInputs');
export const commitExchange = createAction('exchange/commit');
