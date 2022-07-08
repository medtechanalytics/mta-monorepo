import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { RecoilRoot } from "recoil"

import App from './App'
import { AuthProvider } from "contexts/authContext"
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </RecoilRoot>
   </React.StrictMode>
)
