import React, { useState } from 'react'
import { Input, Button, ButtonGroup, Spinner } from "reactstrap"
import { TrackResponse } from "./TrackResponse"

import './App.css'

function renderTrackSummary(track: TrackResponse | undefined) {
  if (track === undefined) {
    return null
  }

  return (
    <div className="trackSummary">
      <div className="flex">
        <img
          className="trackArtwork"
          src={track.artworkUrl}
          alt={track.name} />

        <div className="text-left">
          <div className="songName">{track.name}</div>
          <div className="artistName">{track.artist}</div>
          <div className="albumName">{track.album} ({track.year})</div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [trackData, setTrackData] = useState<TrackResponse | undefined>(undefined)
  const [showDescriptions, setShowDescriptions] = useState(false)
  const [showError, setShowError] = useState(false)

  const getEnergyFromUrl = (url: string) => {
    // url looks like "https://open.spotify.com/track/6NpfAWrIs39a15xlDwHKEK"
    const regex = /https:\/\/.+spotify.com\/track\/(\w+)/g
    let matches = url.matchAll(regex)
    let trackIdMatch = matches.next()

    if (trackIdMatch.value !== undefined) {
      let trackId = trackIdMatch.value[1]
      getEnergy(trackId)
    }
    else {
      setShowError(true)
    }
  }

  const getEnergy = (trackId: string) => {
    setShowError(false)
    setLoading(true)

    let endpoint = `${process.env.REACT_APP_API_URL}?track=${trackId}`
    fetch(endpoint)
      .then(response => {
          if (response.status === 200) {
              return response
          }

          throw new Error(`Tried to get energy for track ${trackId} but failed with status ${response.status}!`)
      })
      .then(response => response.json())
      .then((trackData: TrackResponse) => {
          let concreteTrackData = TrackResponse.from(trackData)
          setTrackData(concreteTrackData)
      })
      .catch(() => {
        setTrackData(undefined)
        setShowError(true)
      })
      .then(() => setLoading(false))
  }

  const renderEnergy = (score: number | undefined, maxScore: number) => {
    let scoreElement = <span>?</span>
    if (loading) {
      scoreElement = <Spinner color="primary" />
    }
    else if (score !== undefined) {
      let percentage = Math.trunc(100 * score)
      scoreElement = <span>{percentage}%</span>

      if (percentage >= Math.trunc(100 * maxScore)) {
        scoreElement = <b>{scoreElement}</b>
      }
    }

    return scoreElement
  }

  const renderEnergies = (track: TrackResponse | undefined) => {
    // determine which scores should be bold
    let maxScore = track?.getMaxScore() ?? -1

    let data = [
      {
        heading: "Monday",
        score: track?.mondayEnergy,
        description: "experimental / noise / metal / grind / sixth world / misanthropic stuff"
      },
      {
        heading: "Tuesday",
        score: track?.tuesdayEnergy,
        description: "techno / idm / glitch / illbient / deconstructed club / ambient / experimental"
      },
      {
        heading: "Wednesday",
        score: track?.wednesdayEnergy,
        description: "ethereal / confident / uplifting / new age / majestic / orchestral / psychedelic"
      },
      {
        heading: "Thursday",
        score: track?.thursdayEnergy,
        description: "joyous / confident / enigmatic / arrogant / charismatic"
      },
      {
        heading: "Friday",
        score: track?.fridayEnergy,
        description: "rave / hedonistic / party / unhinged / unstoppable"
      },
    ]

    return (
      <div className="percentages">
        {data.map((d, i) => {
          let headingElement = (
            <div>
              <span className="tableHeading">{d.heading}</span>
            </div>
          )

          let scoreElement = (
            <div>
              {renderEnergy(d.score, maxScore)}
            </div>
          )

          let descriptionClassName = "energyDescription"
          if (!showDescriptions) {
            descriptionClassName = "energyDescription hidden"
          }

          let descriptionElement = (
            <div className={descriptionClassName}>
              <span>{d.description}</span>
            </div>
          )

          let containerClassName = "energyContainer"
          if (i > 0) {
            containerClassName += "-added"
          }

          return (
            <div className={containerClassName}>
              {headingElement}
              {scoreElement}
              {descriptionElement}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="elements">
          <div className="title">
            <h1>Music Energy Calculator</h1>
            <span className="subheading">
              See which day suits your favourite song the best!
            </span>
          </div>

          <div>
            <div className="searchContainer">
              <Input
                className="urlInput"
                invalid={showError}
                placeholder="Spotify track URL"
                onChange={s => {
                  setUrl(s.target.value)
                  setShowError(false)
                }} />

              <ButtonGroup className="buttonContainer">
                <Button
                  color="primary"
                  className="getButton"
                  disabled={loading || url.length <= 0}
                  onClick={_ => getEnergyFromUrl(url)}>
                  Get Energy
                </Button>

                <Button
                  color="danger"
                  className="clearButton"
                  disabled={trackData === undefined}
                  onClick={_ => setTrackData(undefined)}>
                  Clear
                </Button>

                <Button
                  color="info"
                  className="infoButton"
                  onClick={_ => setShowDescriptions(!showDescriptions)}>
                  ?
                </Button>
              </ButtonGroup>
            </div>

            {renderTrackSummary(trackData)}

            {renderEnergies(trackData)}
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
