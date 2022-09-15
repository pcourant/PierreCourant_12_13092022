import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

import { Outlet } from 'react-router-dom';

import Header from './Components/Header';
import Sidebar from './Components/Sidebar';

const GlobalStyle = createGlobalStyle`
  ${normalize}
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
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
      <Sidebar />
      {/* <Outlet /> */}
      {/* <Footer /> */}
    </>
  );
};

export default App;
