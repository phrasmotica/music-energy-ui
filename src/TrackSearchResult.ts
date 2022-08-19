/**
 * Model for a result returned from a track search.
 */
export interface TrackSearchResult {
    id: string
    name: string
    artist: string
    album: string
    year: number
    artworkUrl: string
}
