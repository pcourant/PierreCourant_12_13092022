import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

import { Outlet } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

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

const StyledMain = styled.main`
  position: relative;
  left: 117px;
  padding-top: 68px;
  padding-left: 109px;
  padding-right: 90px;
  display: flex;
  flex-flow: column nowrap;
  row-gap: 77px;
`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Sidebar />
      <StyledMain>
        <Outlet />
      </StyledMain>
    </>
  );
};

export default App;
