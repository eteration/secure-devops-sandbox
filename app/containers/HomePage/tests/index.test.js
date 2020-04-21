import React from 'react';
import { render } from 'react-testing-library';
import { browserHistory } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from '../../../configureStore';
import { translationMessages } from '../../../i18n';

import HomePage, { LanguageButton, mapDispatchToProps } from '../index';
import { changeLocale } from '../../LanguageProvider/actions';
import LanguageProvider from '../../LanguageProvider';

describe('<HomePage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('Language button should render and match the snapshot', () => {
    const onLocaleToggle = jest.fn();
    const {
      container: { firstChild },
    } = render(<LanguageButton lang="tr" onLocaleToggle={onLocaleToggle} />);
    expect(firstChild).toMatchSnapshot();
    expect(onLocaleToggle).not.toHaveBeenCalled();
    onLocaleToggle('tr');
    expect(onLocaleToggle).toHaveBeenCalled();
  });

  it('HomePage should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <HomePage />
        </LanguageProvider>
      </Provider>,
    );
    expect(firstChild).toMatchSnapshot();
  });

  it('There should be two buttons', () => {
    const { container } = render(
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <HomePage />
        </LanguageProvider>
      </Provider>,
    );
    expect(container.querySelector('button')).not.toBeNull();
  });

  it('Click en button', () => {
    const { container } = render(
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <HomePage />
        </LanguageProvider>
      </Provider>,
    );
    expect(container.querySelector('button')).not.toBeNull();
  });

  describe('mapDispatchToProps', () => {
    describe('onLocaleToggle', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onLocaleToggle).toBeDefined();
      });

      it('should dispatch changeLocale when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const locale = 'tr';
        result.onLocaleToggle(locale);
        expect(dispatch).toHaveBeenCalledWith(changeLocale(locale));
      });
    });
  });
});
