/**
 * Model for responses outlining track energy scores.
 */
export interface TrackEnergyResponse {
    id: string
    name: string
    artist: string
    album: string
    year: number
    artworkUrl: string
    acousticness: number
    danceability: number
    energy: number
    instrumentalness: number
    liveness: number
    normalisedLoudness: number
    speechiness: number
    valence: number
    misanthropy: number
    hypnotism: number
    majesty: number
    confidence: number
    hedonism: number
}
