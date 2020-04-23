import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import { LanguageButton } from '../index';

describe('<LanguageButton />', () => {
  it('should render an <button> tag', () => {
    const { container } = render(<LanguageButton />);
    expect(container.querySelector('button')).not.toBeNull();
  });

  it('should have a class attribute', () => {
    const { container } = render(<LanguageButton />);
    expect(container.querySelector('button').hasAttribute('type')).toBe(true);
  });

  it('should handle click events', () => {
    const onClickSpy = jest.fn();
    const { container } = render(
      <LanguageButton onLocaleToggle={onClickSpy} />,
    );
    fireEvent.click(container.querySelector('button'));
    expect(onClickSpy).toHaveBeenCalled();
  });
});
