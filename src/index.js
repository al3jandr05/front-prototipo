import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<<<<<<< HEAD
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

=======
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />

        </ApolloProvider>
    </React.StrictMode>
);
>>>>>>> nube
