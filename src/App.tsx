import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Clean } from './clean/pages/Clean';
import { Layout } from './common/components/Layout';
import { Routes as RoutesClean } from './clean/Routing'

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path={RoutesClean.home.path} element={<Clean />}/>
          <Route path="*" element={<h1>404 NOT FOUND</h1>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
