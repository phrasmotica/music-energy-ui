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
            heading: "Monday",
            score: trackData?.mondayEnergy,
            description:
                "experimental / noise / metal / grind / sixth world / misanthropic stuff",
        },
        {
            heading: "Tuesday",
            score: trackData?.tuesdayEnergy,
            description:
                "techno / idm / glitch / illbient / deconstructed club / ambient / experimental",
        },
        {
            heading: "Wednesday",
            score: trackData?.wednesdayEnergy,
            description:
                "ethereal / confident / uplifting / new age / majestic / orchestral / psychedelic",
        },
        {
            heading: "Thursday",
            score: trackData?.thursdayEnergy,
            description:
                "joyous / confident / enigmatic / arrogant / charismatic",
        },
        {
            heading: "Friday",
            score: trackData?.fridayEnergy,
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
        track.mondayEnergy,
        track.tuesdayEnergy,
        track.wednesdayEnergy,
        track.thursdayEnergy,
        track.fridayEnergy,
    ]

    return scores.reduce((x, y) => Math.max(x, y))
}
