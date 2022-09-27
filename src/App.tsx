import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './common/components/Layout';
import { Routes as RoutesClean } from './clean/Routing'
import { Clean } from './clean/pages/Clean';
import { Routes as RoutesConfig } from './config/Routing'
import { Config } from './config/pages/Config';
import {CleanProvider} from "./common/contexts/CleanContext";

function App() {
  return (
    <div className="App">
      <CleanProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path={RoutesClean.home.path} element={<Clean />}/>
              <Route path={RoutesConfig.home.path} element={<Config />}/>
              <Route path="*" element={<h1>404 NOT FOUND</h1>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </CleanProvider>
    </div>
  );
}

export default App;
