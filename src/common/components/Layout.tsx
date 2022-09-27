import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { MainContainer } from './MainContainer'

export const Layout: React.FC = () => {
  return (
    <div>
      <Header/>
      <MainContainer>
        <Outlet/>
      </MainContainer>
    </div>
  )
}