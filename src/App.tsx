import { useEffect, useState } from "react"
import { Input, Button, ButtonGroup } from "reactstrap"

import { copyToClipboard, saveAsPng } from "./ExportHelpers"
import { fetchEnergy, fetchTrackSearchResults } from "./FetchHelpers"

import { ScoresTable } from "./ScoresTable"
import { SearchResults } from "./SearchResults"
import { TrackEnergyResponse } from "./TrackEnergyResponse"
import { TrackSearchResult } from "./TrackSearchResult"
import { TrackSummary } from "./TrackSummary"

import "./App.css"

type StringMap = { [key: string]: string }

const App = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [lastSearchQuery, setLastSearchQuery] = useState("")
    const [searchError, setSearchError] = useState(false)

    const [loadingTrackData, setLoadingTrackData] = useState(false)
    const [trackData, setTrackData] = useState<TrackEnergyResponse>()

    const [imageUrlMap, setImageUrlMap] = useState<StringMap>({})

    const [loadingTrackSearchResults, setLoadingTrackSearchResults] = useState(false)
    const [trackSearchResults, setTrackSearchResults] = useState<TrackSearchResult[]>([])

    const [copyMessage, setCopyMessage] = useState<string>()

    useEffect(() => {
        if (trackData && !imageUrlMap[trackData.artworkUrl]) {
            // download artwork locally (if we don't already have it) so it can
            // be copied to clipboard. This is an html2canvas limitation
            // https://stackoverflow.com/a/66079045
            fetch(trackData.artworkUrl)
            .then(res => res.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(url => {
                setImageUrlMap(map => ({
                    [trackData.artworkUrl]: url,
                    ...map,
                }))
            })
        }
    }, [trackData, imageUrlMap])

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
        setLoadingTrackData(true)

        fetchEnergy(trackId)
            .then(setTrackData)
            .catch(() => {
                setTrackData(undefined)
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
    }

    const onCopy = () => peekCopyMessage("Copied to clipboard!")
    const onFailToCopy = () => peekCopyMessage("Failed to copy!")

    const peekCopyMessage = (msg: string) => {
        setCopyMessage(msg)
        setTimeout(() => setCopyMessage(undefined), 3000)
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
                            disabled={!trackData || copyMessage !== undefined}
                            onClick={() => copyToClipboard(onCopy, onFailToCopy)}>
                            {copyMessage ?? "Copy to clipboard"}
                        </Button>

                        <Button
                            color="primary"
                            disabled={!trackData}
                            onClick={() => saveAsPng(trackData!)}>
                            Download as PNG
                        </Button>
                    </ButtonGroup>
                </div>

                <div id="shareable">
                    {trackData && <TrackSummary
                        track={trackData}
                        imageUrl={imageUrlMap[trackData.artworkUrl]} />}

                    <ScoresTable
                        track={trackData}
                        loadingTrackData={loadingTrackData} />

                    <div className="watermark">
                        <span>https://musicenergy.azurewebsites.com</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
