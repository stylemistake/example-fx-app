import React from 'react';
import ReactDOM from 'react-dom';
import { Layout } from './Layout';
import { createStore, Provider } from './store';
import './styles/main.scss';
import '@fortawesome/fontawesome-free/css/all.css';

let rootNode;

const store = createStore();

const renderApp = () => {
  if (!rootNode) {
    rootNode = document.getElementById('root');
  }
  const vNode = (
    <React.StrictMode>
      <Provider store={store}>
        <Layout />
      </Provider>
    </React.StrictMode>
  );
  ReactDOM.render(vNode, rootNode);
};

const setupApp = () => {
  // Delay setup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupApp);
    return;
  }
  // Subscribe for state updates
  store.subscribe(renderApp);
  // Do an initial render
  renderApp();
};

setupApp();
