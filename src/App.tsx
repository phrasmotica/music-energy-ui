import { useRef, useState } from "react"
import { exportComponentAsJPEG } from "react-component-export-image"
import { Input, Button, ButtonGroup } from "reactstrap"

import { createExportParams } from "./ExportHelpers"
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

    const [showError, setShowError] = useState(false)

    const shareComponentRef = useRef(null)

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
                        Discover the traits of your favourite songs!
                    </span>
                </div>

                <div>
                    <div className="search-bar">
                        <Input
                            placeholder="Search for a song!"
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
                            disabled={!trackData}
                            onClick={clear}>
                            Clear
                        </Button>

                        <Button
                            color="primary"
                            disabled={!trackData}
                            onClick={() => exportComponentAsJPEG(shareComponentRef, createExportParams(trackData!))}>
                            Download as JPEG
                        </Button>
                    </ButtonGroup>
                </div>

                <div className="shareable" ref={shareComponentRef}>
                    {trackData && <TrackSummary track={trackData} />}

                    <ScoresTable
                        track={trackData}
                        loadingTrackData={loadingTrackData} />
                </div>
            </div>
        </div>
    )
}

export default App
