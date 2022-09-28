import React, { ReactNode } from 'react'

export interface MainContainerProps {
  children: ReactNode
}
export const MainContainer: React.FC<MainContainerProps> = ({ children }) => 
    <div className='MainContainer' style={{height: '100%', width: '100%'}}>
        {children}
    </div>