export const selectExchange = state => state.exchange;

export const selectCanExchange = state => {
  const exchange = state.exchange;
  const pocketFrom = state.pocket.bySymbol[exchange.fromSymbol];
  return pocketFrom
    && exchange.fromAmount > 0
    && pocketFrom.balance >= exchange.fromAmount;
};
