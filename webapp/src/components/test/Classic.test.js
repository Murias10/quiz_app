import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { AuthContext } from '../../context/AuthContext'
import Classic from '../GameModes/Classic'

i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        'play.gamemode.classic.title': 'Choose difficulty',
        'play.gamemode.classic.easy': 'Easy',
        'play.gamemode.classic.medium': 'Medium',
        'play.gamemode.classic.hard': 'Hard',
      },
    },
  },
})

const mockUser = {}

describe('test for classic component', () => {
  test('renders difficulty selection when no level is selected', async () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <I18nextProvider i18n={i18n}>
          <Classic />
        </I18nextProvider>
      </AuthContext.Provider>
    )

    expect(await screen.findByText('Choose difficulty')).toBeInTheDocument()
    expect(await screen.findByText('Easy')).toBeInTheDocument()
    expect(await screen.findByText('Medium')).toBeInTheDocument()
    expect(await screen.findByText('Hard')).toBeInTheDocument()
  })

  test('difficulty selection disappears when a level is selected', async () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <I18nextProvider i18n={i18n}>
          <Classic />
        </I18nextProvider>
      </AuthContext.Provider>
    )

    fireEvent.click(await screen.findByText('Easy'))
    expect(screen.queryByText('Choose difficulty')).not.toBeInTheDocument()
    expect(screen.queryByText('Easy')).not.toBeInTheDocument()
    expect(screen.queryByText('Medium')).not.toBeInTheDocument()
    expect(screen.queryByText('Hard')).not.toBeInTheDocument()
  })
})
