import { Alert, Spinner } from "reactstrap"

import { TrackSearchResult } from "./TrackSearchResult"

interface SearchResultsProps {
    results: TrackSearchResult[]
    lastSearchQuery: string
    loading: boolean
    searchError: boolean
    onClick: (id: string) => void
}

export const SearchResults = (props: SearchResultsProps) => {
    if (props.loading) {
        return (
            <Spinner
                className="search-results-spinner"
                color="primary"
                size="sm" />
        )
    }

    if (props.lastSearchQuery.length <= 0) {
        return null
    }

    if (props.searchError && props.results.length <= 0) {
        return (
            <Alert className="search-alert" color="danger" fade={false}>
                We couldn't find that track!
            </Alert>
        )
    }
    else if (props.results.length <= 0) {
        return null
    }

    const renderTrackResult = (result: TrackSearchResult) => (
        <div key={result.id} className="search-result">
            <button onClick={() => props.onClick(result.id)}>
                <div className="search-result-content">
                    <img
                        className="track-artwork small"
                        src={result.artworkUrl}
                        alt={result.name} />

                    <div>
                        <div>{result.name}</div>
                        <div className="artist-name-small">
                            {result.artist} - {result.album} ({result.year})
                        </div>
                    </div>
                </div>
            </button>
        </div>
    )

    return (
        <div className="search-results">
            {props.results.map(renderTrackResult)}
        </div>
    )
}
