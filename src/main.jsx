import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';

import { Provider } from 'react-redux';   // ✅ import Provider
import store from './redux/store.js';     // ✅ import store
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>   {/* ✅ Wrap your app with Provider */}
      <App />
      <Toaster position="top-center" reverseOrder={false} />
    </Provider>
  </StrictMode>
);








