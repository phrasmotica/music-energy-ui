import React, { useState } from 'react'
import { Input, Button, ButtonGroup, Spinner } from "reactstrap"
import { TrackResponse } from "./TrackResponse"

import './App.css'

function App() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [trackData, setTrackData] = useState<TrackResponse | undefined>(undefined)

  const getEnergyFromUrl = (url: string) => {
    // url looks like "https://open.spotify.com/track/6NpfAWrIs39a15xlDwHKEK"
    const regex = /https:\/\/.+spotify.com\/track\/(\w+)/g
    let matches = url.matchAll(regex)
    let trackIdMatch = matches.next()
    let trackId = trackIdMatch.value[1]
    getEnergy(trackId)
  }

  const getEnergy = (trackId: string) => {
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
      .catch(error => console.error(error))
      .then(() => setLoading(false))
  }

  const renderTrackSummary = (track: TrackResponse | undefined) => {
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

    return (
      <div className="percentages">
        <div className="energyContainer">
          <div>
            <span className="tableHeading">Monday</span>
          </div>
          <div>
            <span>{renderEnergy(track?.mondayEnergy, maxScore)}</span>
          </div>
        </div>

        <div className="energyContainer">
          <div>
            <span className="tableHeading">Tuesday</span>
          </div>
          <div>
            <span>{renderEnergy(track?.tuesdayEnergy, maxScore)}</span>
          </div>
        </div>

        <div className="energyContainer">
          <div>
            <span className="tableHeading">Wednesday</span>
          </div>
          <div>
            <span>{renderEnergy(track?.wednesdayEnergy, maxScore)}</span>
          </div>
        </div>

        <div className="energyContainer">
          <div>
            <span className="tableHeading">Thursday</span>
          </div>
          <div>
            <span>{renderEnergy(track?.thursdayEnergy, maxScore)}</span>
          </div>
        </div>

        <div className="energyContainer">
          <div>
            <span className="tableHeading">Friday</span>
          </div>
          <div>
            <span>{renderEnergy(track?.fridayEnergy, maxScore)}</span>
          </div>
        </div>
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
                placeholder="Spotify track URL"
                onChange={s => setUrl(s.target.value)} />

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
