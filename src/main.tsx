
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enable view transitions if supported
if ('startViewTransition' in document) {
  (document as any).startViewTransition = (document as any).startViewTransition || 
    ((callback: () => void) => callback());
}

createRoot(document.getElementById("root")!).render(<App />);
