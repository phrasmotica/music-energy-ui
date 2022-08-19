import { TrackEnergyResponse } from "./TrackEnergyResponse"
import { TrackSearchResult } from "./TrackSearchResult"

export const fetchTrackSearchResults = (query: string) =>
    fetch(`${process.env.REACT_APP_API_URL}/TrackSearch?query=${encodeURI(query)}`)
        .then(res => {
            if (res.status === 200) {
                return res
            }

            throw new Error(`Tried to get track results for search query ${query} but failed with status ${res.status}!`)
        })
        .then(res => res.json())
        .then((data: TrackSearchResult[]) => data)

export const fetchEnergy = (trackId: string) =>
    fetch(`${process.env.REACT_APP_API_URL}/MusicEnergyCalculator?track=${trackId}`)
        .then(res => {
            if (res.status === 200) {
                return res
            }

            throw new Error(`Tried to get energy for track ${trackId} but failed with status ${res.status}!`)
        })
        .then(res => res.json())
        .then((data: TrackEnergyResponse) => data)
