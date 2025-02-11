import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const useStrict = true;

createRoot(document.getElementById('root')!).render(
    useStrict ? (
        <StrictMode>
            <App />
        </StrictMode>
    ) : (
        <App />
    ),
);
