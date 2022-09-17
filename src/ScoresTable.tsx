import { EnergyBar } from "./EnergyBar"

import { TrackEnergyResponse } from "./TrackEnergyResponse"

interface ScoresTableProps {
    track: TrackEnergyResponse | undefined
    loadingTrackData: boolean
}

export const ScoresTable = (props: ScoresTableProps) => {
    let trackData = props.track

    // determine which scores should be bold
    let maxScore = getMaxScore(trackData)

    let data = [
        {
            heading: "Misanthropy",
            score: trackData?.misanthropy,
            description:
                "experimental / noise / metal / grind / sixth world / misanthropic stuff",
        },
        {
            heading: "Hypnotism",
            score: trackData?.hypnotism,
            description:
                "techno / idm / glitch / illbient / deconstructed club / ambient / experimental",
        },
        {
            heading: "Majesty",
            score: trackData?.majesty,
            description:
                "ethereal / confident / uplifting / new age / majestic / orchestral / psychedelic",
        },
        {
            heading: "Confidence",
            score: trackData?.confidence,
            description:
                "joyous / confident / enigmatic / arrogant / charismatic",
        },
        {
            heading: "Hedonism",
            score: trackData?.hedonism,
            description: "rave / hedonistic / party / unhinged / unstoppable",
        },
    ]

    return (
        <div className="percentages">
            {data.map((d, i) => (
                <EnergyBar
                    key={i}
                    detail={d}
                    loading={props.loadingTrackData}
                    maxScore={maxScore} />
            ))}
        </div>
    )
}

const getMaxScore = (track: TrackEnergyResponse | undefined) => {
    if (!track) {
        return -1
    }

    const scores = [
        track.misanthropy,
        track.hypnotism,
        track.majesty,
        track.confidence,
        track.hedonism,
    ]

    return scores.reduce((x, y) => Math.max(x, y))
}
