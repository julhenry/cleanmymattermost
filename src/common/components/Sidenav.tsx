import React from 'react'
import { Link } from 'react-router-dom'
import { Routes as RoutesClean } from '../../clean/Routing'
import './Sidenav.css'

export const Sidenav: React.FC = () => {
  return (
    <div className='Sidenav'>
        <ul>
            <Link to='config'><li>Config</li></Link>
            <Link to={RoutesClean.home.path}><li>{RoutesClean.home.label}</li></Link>
        </ul>
    </div>
  )
}