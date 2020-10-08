import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { round, toFixed } from './common/math';
import { AnimatedNumber } from './components/AnimatedNumber';
import { Box } from './components/Box';
import { Flex } from './components/Flex';
import { Icon } from './components/Icon';
import { Input } from './components/Input';
import { commitExchange, updateInputs } from './exchange/actions';
import { selectCanExchange, selectExchange } from './exchange/selectors';
import './ExchangeWidget.scss';
import { formatMoney } from './format';
import { selectPockets } from './pocket/selectors';

const SymbolDropdown = props => {
  const { symbol, onChange } = props;
  const pockets = useSelector(selectPockets);
  return (
    <select
      className="ExchangeWidget__SymbolDropdown"
      value={symbol}
      onChange={e => {
        const index = e.target.selectedIndex;
        if (onChange) {
          onChange(pockets[index]?.symbol);
        }
      }}>
      {pockets.map(pocket => (
        <option key={pocket.symbol} value={pocket.symbol}>
          {pocket.symbol}
        </option>
      ))}
    </select>
  );
};

const InputSection = props => {
  const {
    pocket,
    amount,
    amountError,
    onAmountChange,
    onSymbolChange,
  } = props;
  return (
    <Box>
      <Flex align="baseline">
        <Flex.Item>
          <SymbolDropdown
            symbol={pocket.symbol}
            onChange={onSymbolChange} />
        </Flex.Item>
        <Flex.Item ml={1} grow={1}>
          <Input
            className="ExchangeWidget__input"
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={toFixed(round(amount, 2), 2)}
            onKeyDown={e => {
              // NOTE: Not the prettiest solution, but hey, it works!
              // Special key (e.g. backspace)
              if (e.key.length > 1) {
                return;
              }
              let input = e.target.value;
              if (/^[0-9.]$/.test(e.key)) {
                input += e.key;
              }
              console.log(input, e.key);
              // Discard inputs that do not look like a decimal number.
              if (!/^\d+(\.\d?\d?)?$/.test(input)) {
                console.log('prevented');
                e.preventDefault();
                return;
              }
            }}
            onInput={e => {
              const number = parseFloat(e.target.value);
              if (Number.isFinite(number)) {
                onAmountChange(number);
              }
              else if (e.target.value === '') {
                onAmountChange(0);
              }
            }}/>
        </Flex.Item>
      </Flex>
      <Flex align="baseline" mt={1}>
        <Flex.Item
          className="ExchangeWidget__label"
          grow={1}>
          {'Balance: '}
          <AnimatedNumber
            key={pocket.symbol}
            value={pocket.balance}
            format={value => formatMoney(value, 2)} />
        </Flex.Item>
        {amountError && (
          <Flex.Item
            className="ExchangeWidget__label ExchangeWidget__error">
            {amountError}
          </Flex.Item>
        )}
      </Flex>
    </Box>
  );
};

const Divider = props => (
  <Box className="ExchangeWidget__divider" />
);

export const ExchangeWidget = props => {
  const pockets = useSelector(selectPockets);
  const {
    rate,
    fromSymbol,
    toSymbol,
    fromAmount,
    toAmount,
  } = useSelector(selectExchange);
  const canExchange = useSelector(selectCanExchange);
  const dispatch = useDispatch();
  const pocketFrom = pockets.find(pocket => pocket.symbol === fromSymbol);
  const pocketTo = pockets.find(pocket => pocket.symbol === toSymbol);
  return (
    <Box className="ExchangeWidget">
      <InputSection
        pocket={pocketFrom}
        amount={fromAmount}
        amountError={pocketFrom.balance < fromAmount && (
          'Not enough balance.'
        )}
        onAmountChange={amount => dispatch(updateInputs({
          fromAmount: amount,
        }))}
        onSymbolChange={symbol => dispatch(updateInputs({
          fromSymbol: symbol,
        }))} />
      <Divider />
      <InputSection
        pocket={pocketTo}
        amount={toAmount}
        onAmountChange={amount => dispatch(updateInputs({
          toAmount: amount,
        }))}
        onSymbolChange={symbol => dispatch(updateInputs({
          toSymbol: symbol,
        }))} />
      <Divider />
      <Flex align="baseline">
        <Flex.Item
          className="ExchangeWidget__rate"
          grow={1}>
          <Icon name="chart-line" mr={1} />
          <AnimatedNumber value={round(rate, 4) || 'Rate is unknown'}>
            {rate => `1 ${fromSymbol} = ${rate} ${toSymbol}`}
          </AnimatedNumber>
        </Flex.Item>
        <Flex.Item>
          <button
            className="ExchangeWidget__button"
            disabled={!canExchange}
            onClick={() => dispatch(commitExchange({
              fromSymbol,
              toSymbol,
              fromAmount,
              toAmount,
            }))}>
            Exchange
          </button>
        </Flex.Item>
      </Flex>
    </Box>
  );
};
