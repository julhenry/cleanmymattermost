import React, { ReactNode } from 'react'

export interface MainContainerProps {
  children: ReactNode
}
export const MainContainer: React.FC<MainContainerProps> = ({ children }) => 
    <div className='MainContainer'>
        {children}
    </div>