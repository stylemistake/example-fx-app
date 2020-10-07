export const selectPockets = state => (
  state.pocket.symbols.map(symbol => state.pocket.bySymbol[symbol])
);
