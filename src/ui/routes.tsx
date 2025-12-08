import React from "react"

import { Layout, theme } from "antd"
import { Navigate, Route, Routes } from "react-router"
import { Content, Header, Footer } from "antd/es/layout/layout"
import PageRounds from "./Routes/PageRounds/PageRounds"
import PageAuth from "./Routes/PageAuth"


type Props = {
  children: React.ReactNode
}

const AppLayout = ({ children }: Props) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
      </Header>
      <Content style={{ padding: "24px 48px 0 48px" }}>
        <Layout style={{ padding: "24px 0", background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <Content style={{ padding: "0 24px", minHeight: 280 }}>{children}</Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: "center" }}></Footer>
    </Layout>
  )
}

export const AppRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/auth" element={<PageAuth />} />
        <Route path="/rounds" element={<PageRounds />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </AppLayout>
  )
}