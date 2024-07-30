import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div>
      <h1>Welcome to the Home Page! Woot!</h1>
    </div>
  );
};

const appDiv = document.getElementById('app');
const root = ReactDOM.createRoot(appDiv);
root.render(<App />);
