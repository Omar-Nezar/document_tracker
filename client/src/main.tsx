import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { TooltipProvider } from "@/components/ui/tooltip"
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <TooltipProvider>
          <App />
        </TooltipProvider>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
