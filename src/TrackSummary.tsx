import { TrackEnergyResponse } from "./TrackEnergyResponse"

interface TrackSummaryProps {
    track: TrackEnergyResponse
}

export const TrackSummary = (props: TrackSummaryProps) => {
    return (
        <div className="track-summary">
            <img
                className="track-artwork"
                src={props.track.artworkUrl}
                alt={props.track.name} />

            <div>
                <div className="song-name">{props.track.name}</div>
                <div>{props.track.artist}</div>
                <div>
                    {props.track.album} ({props.track.year})
                </div>
            </div>
        </div>
    )
}
