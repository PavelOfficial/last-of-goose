import React from "react"
import { ConfigProvider } from "antd"
import { BrowserRouter } from "react-router"
import ruLocale from "antd/es/locale/ru_RU"

import { AppRoutes } from "./routes"
import { StoreProvider } from "../store/StoreProvider"
import ErrorBoundary from "../libs/ErrorBoundary"

const App: React.FC = () => {
  return (
    <StoreProvider>
      <ConfigProvider locale={ruLocale}>
        <React.Suspense fallback={null}>
          <ErrorBoundary>
            <BrowserRouter basename="/">
              <AppRoutes />
            </BrowserRouter>
          </ErrorBoundary>
        </React.Suspense>
      </ConfigProvider>
    </StoreProvider>
  )
}

export default App;
