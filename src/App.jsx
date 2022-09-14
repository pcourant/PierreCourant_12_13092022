import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

import { Outlet } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './Components/Header';

const GlobalStyle = createGlobalStyle`
  ${normalize}
  body {
    font-family: 'Roboto', sans-serif;
    color: black;
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
  }
`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Header />
      {/* <Outlet /> */}
      {/* <Footer /> */}
    </>
  );
};

export default App;
