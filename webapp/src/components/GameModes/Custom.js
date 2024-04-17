import Quiz from '../../components/Quiz/Quiz'
import Button from '../../components/Button/Button'

import '../../pages/Game/Game.css'
import './Custom.css'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'

const DEFAULT_TIME = 15
const DEFAULT_NUMBER_OF_QUESTIONS = 10

const Custom = ({ goBack }) => {
  const [hasFinishedConfiguration, setHasFinishedConfiguration] =
    useState(false)
  const [timeInSeconds, setTimeInSeconds] = useState(DEFAULT_TIME)
  const [numOfQuestions, setNumOfQuestions] = useState(
    DEFAULT_NUMBER_OF_QUESTIONS
  )

  const { t } = useTranslation()

  const handleTimeChange = e => {
    setTimeInSeconds(e.target.value)
  }

  const handleNumOfQuestionsChange = e => {
    setNumOfQuestions(e.target.value)
  }

  return (
    <>
      <div className="quiz-wrapper">
        {!hasFinishedConfiguration && (
          <div className="header-and-buttons-container">
            <h2>{t('play.gamemode.custom.title')}</h2>
            <div className="custom-option">
              <label htmlFor="timeSlider">{t('play.gamemode.custom.time')}</label>
              <input
                type="range"
                id="timeSlider"
                min={3}
                max={60}
                step={1}
                value={timeInSeconds}
                onChange={handleTimeChange}
              />
              <span>{timeInSeconds}</span>
            </div>
            <div className="custom-option">
              <label htmlFor="questionsSlider">{t('play.gamemode.custom.questions')}</label>
              <input
                type="range"
                id="questionsSlider"
                min={3}
                max={30}
                step={1}
                value={numOfQuestions}
                onChange={handleNumOfQuestionsChange}
              />
              <span>{numOfQuestions}</span>
            </div>
            <div className="button-container">
              <Button
                onClick={() => {
                  setHasFinishedConfiguration(true)
                }}
              >
                {t('play.gamemode.custom.start_button')}
              </Button>
              <Button onClick={goBack} className="danger">
                {t('play.gamemode.custom.go_back_button')}
              </Button>
            </div>
          </div>
        )}
        {hasFinishedConfiguration && (
          <Quiz
            configuration={{
              numberOfQuestions: numOfQuestions,
              timePerQuestion: timeInSeconds,
              pointsPerQuestion: Math.floor(150 / timeInSeconds),
            }}
            goBack={goBack}
          />
        )}
      </div>
    </>
  )
}

export default Custom
