import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { store } from './store';
import { Provider } from 'react-redux';

const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(
  // provide the redux store to react
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);