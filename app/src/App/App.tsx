import styles from './App.module.scss';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import MoviesPage from '../pages/MoviesPage';
import SingleMoviePage from '../pages/SingleMoviePage';
// import { api } from './../api';

console.log(styles);

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>
                Страница описания v1 <Link to={'/home'}>Link</Link>
              </h1>
              <MoviesPage></MoviesPage>
            </>
          }
        />
        <Route
          path="/film/:id"
          element={
            <>
              <h1>
                Главная страница <Link to={'/'}>Link</Link>
              </h1>
              <SingleMoviePage></SingleMoviePage>
            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;
