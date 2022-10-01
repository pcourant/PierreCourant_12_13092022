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
  margin-left: 8.125vw;
  /* margin-left: 117px; */
  padding-top: 2.5vw;
  padding-left: 7.57vw;
  padding-right: 6.25vw;
  display: flex;
  flex-flow: column nowrap;
  row-gap: 3.5vw;
  /* row-gap: 5.34vw; */
`;

/**
 * The skeleton of the SPA.
 */
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
