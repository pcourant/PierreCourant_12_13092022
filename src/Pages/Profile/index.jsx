import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';
import PropTypes from 'prop-types';
import HeaderMain from '../../components/HeaderMain';

const Profile = (props) => {
  return (
    <>
      <HeaderMain
        title={'Bonjour Thomas'}
        subtitle={'Félicitation ! Vous avez explosé vos objectifs hier 👏'}
      />
    </>
  );
};

Profile.propTypes = {};

export default Profile;
