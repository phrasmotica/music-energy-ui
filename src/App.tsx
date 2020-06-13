import React, { useState } from 'react'
import { Input, Button, InputGroup, InputGroupAddon, Spinner } from "reactstrap"
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

  const renderEnergy = (score: number | undefined) => {
    let scoreElement = <span>?</span>
    if (loading) {
      scoreElement = <Spinner color="primary" />
    }
    else if (score !== undefined) {
      scoreElement = <span>{Math.trunc(100 * score)}%</span>
    }

    return scoreElement
  }

  const renderEnergies = () => {
    return (
      <div>
        <table style={{ width: "100%", tableLayout: "fixed" }}>
          <tr>
            <th><span className="tableHeading">Monday</span></th>
            <th><span className="tableHeading">Tuesday</span></th>
            <th><span className="tableHeading">Wednesday</span></th>
            <th><span className="tableHeading">Thursday</span></th>
            <th><span className="tableHeading">Friday</span></th>
          </tr>
          <tr>
            <td>{renderEnergy(trackData?.mondayEnergy)}</td>
            <td>{renderEnergy(trackData?.tuesdayEnergy)}</td>
            <td>{renderEnergy(trackData?.wednesdayEnergy)}</td>
            <td>{renderEnergy(trackData?.thursdayEnergy)}</td>
            <td>{renderEnergy(trackData?.fridayEnergy)}</td>
          </tr>
        </table>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="title">
          <h1>Music Energy Calculator</h1>
          <span className="subheading">
            See which day suits your favourite song the best!
          </span>
        </div>

        <div className="elements">
          <div>
            <InputGroup>
              <Input
                placeholder="Spotify track URL"
                onChange={s => setUrl(s.target.value)} />

              <InputGroupAddon addonType="append">
                <Button
                  color="primary"
                  disabled={loading || url.length <= 0}
                  onClick={_ => getEnergyFromUrl(url)}>
                  Get Energy
                </Button>
              </InputGroupAddon>

              <InputGroupAddon addonType="append">
                <Button
                  color="danger"
                  disabled={trackData === undefined}
                  onClick={_ => setTrackData(undefined)}>
                  Clear
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {renderEnergies()}
        </div>
      </header>
    </div>
  )
}

export default App
