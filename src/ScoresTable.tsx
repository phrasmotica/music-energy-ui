import { Progress } from "reactstrap"

import { TrackEnergyResponse } from "./TrackEnergyResponse"

interface ScoresTableProps {
    track: TrackEnergyResponse | undefined
    loadingTrackData: boolean
    showDescriptions: boolean
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

    const renderEnergy = (score: number | undefined, maxScore: number) => {
        let scoreElement = (
            <Progress className="score missing" striped value={50}>
                <span>?</span>
            </Progress>
        )

        let percentage = score ? Math.trunc(100 * score) : 50

        if (props.loadingTrackData) {
            scoreElement = (
                <Progress className="score missing" animated value={percentage}>
                    <span>...</span>
                </Progress>
            )
        }
        else if (score !== undefined) {
            let className = "score"

            if (percentage >= Math.trunc(100 * maxScore)) {
                className += " bolded"
            }

            let colour = computeColour(percentage)

            scoreElement = <Progress className={className} color={colour} value={percentage}>
                <span>{percentage}%</span>
            </Progress>
        }

        return scoreElement
    }

    return (
        <div className="percentages">
            {data.map((d, i) => (
                <div key={i} className="energy-container">
                    <div className="energy-container-cell">
                        <span>{d.heading}</span>

                        {renderEnergy(d.score, maxScore)}
                    </div>

                    {props.showDescriptions && <div className="energy-description">
                        <span>{d.description}</span>
                    </div>}
                </div>
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

const computeColour = (percentage: number) => {
    if (percentage >= 80) {
        return "success"
    }

    if (percentage >= 50) {
        return "info"
    }

    if (percentage >= 25) {
        return "warning"
    }

    return "danger"
}
