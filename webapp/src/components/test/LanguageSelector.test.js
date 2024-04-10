import React from 'react';
import { render, screen } from '@testing-library/react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';

const testLanguages = [
    { code: 'en', name: 'English', country_code: 'us' },
    { code: 'es', name: 'Español', country_code: 'es' },
    { code: 'fr', name: 'Français', country_code: 'fr' },
];

test('renders LanguageSelector component with provided languages', () => {
    render(<LanguageSelector languages={testLanguages} />);

    expect(screen.getByText('English')).toBeTruthy();
    expect(screen.getByText('Español')).toBeTruthy();
    expect(screen.getByText('Français')).toBeTruthy();
});