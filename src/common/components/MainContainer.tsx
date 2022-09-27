import React, { ReactNode } from 'react'

export interface MainContainerProps {
  children: ReactNode
}
export const MainContainer: React.FC<MainContainerProps> = ({ children }) => 
    <div className='MainContainer' style={{width: '600px', margin: '50px auto'}}>
        {children}
    </div>