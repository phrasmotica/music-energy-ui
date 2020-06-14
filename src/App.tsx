import React, { useState } from 'react'
import { Input, Button, ButtonGroup, Spinner } from "reactstrap"

import { TrackEnergyResponse } from "./TrackEnergyResponse"
import { TrackSearchResult } from './TrackSearchResult'

import './App.css'

/**
 * Renders a summary of the given track.
 */
function renderTrackSummary(track: TrackEnergyResponse | undefined) {
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

/**
 * Renders the energy scores of the given track.
 */
function renderEnergies(
  track: TrackEnergyResponse | undefined,
  loading: boolean,
  showDescriptions: boolean
) {
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
            {renderEnergy(d.score, maxScore, loading)}
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

/**
 * Renders the given energy score.
 */
function renderEnergy(
  score: number | undefined,
  maxScore: number,
  loading: boolean
) {
  let scoreElement = <span>?</span>
  if (loading) {
    scoreElement = <Spinner className="scoreSpinner" color="primary" />
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

function App() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [trackData, setTrackData] = useState<TrackEnergyResponse | undefined>(undefined)
  const [trackSearchResults, setTrackSearchResults] = useState<TrackSearchResult[]>([])
  const [showDescriptions, setShowDescriptions] = useState(false)
  const [showError, setShowError] = useState(false)

  /**
   * Fetches track results for the given search query.
   */
  const getSearchResults = (query: string) => {
    setLoading(true)

    let endpoint = `${process.env.REACT_APP_API_URL}/TrackSearch?query=${encodeURI(query)}`
    fetch(endpoint)
      .then(response => {
          if (response.status === 200) {
              return response
          }

          throw new Error(`Tried to get track results for search query ${query} but failed with status ${response.status}!`)
      })
      .then(response => response.json())
      .then((searchResults: TrackSearchResult[]) => {
          let concreteResults = searchResults.map(TrackSearchResult.from)
          setTrackSearchResults(concreteResults)

          if (concreteResults.length > 0) {
            getEnergy(concreteResults[0].id)
          }
          else {
            setTrackData(undefined)
            setLoading(false)
          }
      })
      .catch(() => setTrackSearchResults([]))
  }

  /**
   * Fetches energy data for the track with the given ID.
   */
  const getEnergy = (trackId: string) => {
    setShowError(false)
    setLoading(true)

    let endpoint = `${process.env.REACT_APP_API_URL}/MusicEnergyCalculator?track=${trackId}`
    fetch(endpoint)
      .then(response => {
          if (response.status === 200) {
              return response
          }

          throw new Error(`Tried to get energy for track ${trackId} but failed with status ${response.status}!`)
      })
      .then(response => response.json())
      .then((trackData: TrackEnergyResponse) => {
          let concreteTrackData = TrackEnergyResponse.from(trackData)
          setTrackData(concreteTrackData)
      })
      .catch(() => {
        setTrackData(undefined)
        setShowError(true)
      })
      .then(() => setLoading(false))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getSearchResults(searchQuery)
    }
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
              <div className="searchBar">
                <Input
                  className="searchInput"
                  placeholder="search for a track"
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => handleKeyDown(e)} />

                <Button
                  color="success"
                  className="searchButton"
                  disabled={loading || searchQuery.length <= 0}
                  onClick={_ => getSearchResults(searchQuery)}>
                  Search
                </Button>
              </div>

              <ButtonGroup className="buttonContainer">
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

            {renderEnergies(trackData, loading, showDescriptions)}
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
