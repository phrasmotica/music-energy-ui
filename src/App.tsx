import { useState } from "react"
import { Input, Button, ButtonGroup } from "reactstrap"

import { fetchEnergy, fetchTrackSearchResults } from "./FetchHelpers"

import { ScoresTable } from "./ScoresTable"
import { SearchResults } from "./SearchResults"
import { TrackEnergyResponse } from "./TrackEnergyResponse"
import { TrackSearchResult } from "./TrackSearchResult"
import { TrackSummary } from "./TrackSummary"

import "./App.css"

const App = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [lastSearchQuery, setLastSearchQuery] = useState("")
    const [searchError, setSearchError] = useState(false)

    const [loadingTrackData, setLoadingTrackData] = useState(false)
    const [trackData, setTrackData] = useState<TrackEnergyResponse>()

    const [loadingTrackSearchResults, setLoadingTrackSearchResults] = useState(false)
    const [trackSearchResults, setTrackSearchResults] = useState<TrackSearchResult[]>([])

    const [showDescriptions, setShowDescriptions] = useState(false)
    const [showError, setShowError] = useState(false)

    const getSearchResults = (query: string) => {
        setLastSearchQuery(query)
        setLoadingTrackSearchResults(true)

        fetchTrackSearchResults(query)
            .then(setTrackSearchResults)
            .catch(() => {
                setTrackSearchResults([])
                setSearchError(true)
            })
            .finally(() => setLoadingTrackSearchResults(false))
    }

    const getEnergy = (trackId: string) => {
        setShowError(false)
        setLoadingTrackData(true)

        fetchEnergy(trackId)
            .then(setTrackData)
            .catch(() => {
                setTrackData(undefined)
                setShowError(true)
            })
            .finally(() => setLoadingTrackData(false))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.length > 0) {
            getSearchResults(searchQuery)
        }
    }

    const clear = () => {
        setTrackData(undefined)
        setTrackSearchResults([])
        setSearchError(false)
        setShowError(false)
    }

    return (
        <div className="app">
            <div className="elements">
                <div>
                    <h1>Music Energy Calculator</h1>

                    <span className="subheading">
                        See which day suits your favourite song the best!
                    </span>
                </div>

                <div>
                    <div className="search-bar">
                        <Input
                            placeholder="search for a track"
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={e => handleKeyDown(e)} />

                        <Button
                            color="success"
                            disabled={loadingTrackSearchResults || searchQuery.length <= 0}
                            onClick={() => getSearchResults(searchQuery)}>
                            Search
                        </Button>
                    </div>

                    <SearchResults
                        results={trackSearchResults}
                        lastSearchQuery={lastSearchQuery}
                        loading={loadingTrackSearchResults}
                        searchError={searchError}
                        onClick={getEnergy} />

                    <ButtonGroup className="button-container">
                        <Button
                            color="danger"
                            disabled={trackData === undefined}
                            onClick={clear}>
                            Clear
                        </Button>

                        <Button
                            color="info"
                            onClick={() => setShowDescriptions(!showDescriptions)}>
                            ?
                        </Button>
                    </ButtonGroup>
                </div>

                {trackData && <TrackSummary track={trackData} />}

                <ScoresTable
                    track={trackData}
                    loadingTrackData={loadingTrackData}
                    showDescriptions={showDescriptions} />
            </div>
        </div>
    )
}

export default App
