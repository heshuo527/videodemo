import React from 'react';
import ReactDOM from 'react-dom/client';

const MyLazyComponent = React.lazy(() => import('./App'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MyLazyComponent />
  </React.StrictMode>
);
