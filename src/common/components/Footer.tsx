import React from 'react'
import packageJson from "../../../package.json"
import './Footer.css'

export const Footer: React.FC = () => {
  return (
    <div className='Footer'>
        <p>{packageJson.version}</p>
    </div>
  )
}