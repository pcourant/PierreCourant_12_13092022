import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const logo = new URL('../../assets/logo.svg', import.meta.url);

const Header = (props) => {
  return (
    <header>
      <img src={logo} alt="logo" />
      <nav>
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/profile">Profil</NavLink>
        <NavLink to="/setting">Réglage</NavLink>
        <NavLink to="/community">Communauté</NavLink>
      </nav>
    </header>
  );
};

Header.propTypes = {};

export default Header;
