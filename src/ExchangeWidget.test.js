import { render } from '@testing-library/react';
import React from 'react';
import { selectExchange } from './exchange/selectors';
import { ExchangeWidget } from './ExchangeWidget';
import { formatMoney } from './format';
import { selectPockets } from './pocket/selectors';
import { createPureStore, Provider } from './store';

const renderWithStore = (vNode, store) => render(
  <Provider store={store}>
    {vNode}
  </Provider>
);

const prepare = () => {
  const store = createPureStore();
  const vNode = <ExchangeWidget />;
  const queries = renderWithStore(vNode, store);
  return { store, queries };
};

test('shows correct initial balance', () => {
  const {
    store,
    queries: { getAllByText },
  } = prepare();
  const state = store.getState();
  const pockets = selectPockets(state);
  const exchange = selectExchange(state);
  const elements = getAllByText(/Balance:/i);
  const pocketFrom = pockets.find(pocket => (
    pocket.symbol === exchange.fromSymbol
  ));
  const pocketTo = pockets.find(pocket => (
    pocket.symbol === exchange.toSymbol
  ));
  {
    const text = formatMoney(pocketFrom.balance, 2)
      // toHaveTextContent doesn't like our thin space.
      .replace('\u2009', ' ');
    expect(elements[0]).toHaveTextContent(text);
  }
  {
    const text = formatMoney(pocketTo.balance, 2)
      // toHaveTextContent doesn't like our thin space.
      .replace('\u2009', ' ');
    expect(elements[1]).toHaveTextContent(text);
  }
});
