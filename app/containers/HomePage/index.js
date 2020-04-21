/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { changeLocale } from '../LanguageProvider/actions';
import { makeSelectLocale } from '../LanguageProvider/selectors';
import messages from './messages';

function HomePage(props) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>
        <FormattedMessage {...messages.header} />
      </h1>
      <p>
        <FormattedMessage {...messages.detail} />
      </p>
      <div style={{ textAlign: 'center', background: 'black', padding: 20 }}>
        <button type="button" onClick={() => props.onLocaleToggle('en')}>
          en
        </button>{' '}
        -{' '}
        <button type="button" onClick={() => props.onLocaleToggle('tr')}>
          tr
        </button>
        <br />
        <br />
        <img
          alt="Meetups Eteration"
          src="https://meetups.eteration.com/logo.png"
        />
        <p style={{ color: 'white' }}>meetups.eteration.com</p>
      </div>
    </div>
  );
}

HomePage.propTypes = {
  onLocaleToggle: PropTypes.func,
  locale: PropTypes.string,
};

const mapStateToProps = createSelector(
  makeSelectLocale(),
  locale => ({
    locale,
  }),
);

export function mapDispatchToProps(dispatch) {
  return {
    onLocaleToggle: lang => dispatch(changeLocale(lang)),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
