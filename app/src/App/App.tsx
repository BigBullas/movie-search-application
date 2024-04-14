import styles from './App.module.scss';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import { api } from './../api';

console.log(styles);

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/home" element={<h1>Страница описания</h1>} />
      </Routes>
    </>
  );
};

export default App;
