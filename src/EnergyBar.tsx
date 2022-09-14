import { Progress } from "reactstrap"

interface EnergyBarProps {
    detail: {
        heading: string
        score: number | undefined
        description: string
    }

    loading: boolean
    showDescription: boolean
    maxScore: number
}

export const EnergyBar = (props: EnergyBarProps) => {
    const renderEnergyBar = (score: number | undefined) => {
        let scoreElement = (
            <Progress className="score missing" striped value={50}>
                <span>?</span>
            </Progress>
        )

        let percentage = score ? Math.trunc(100 * score) : 50

        if (props.loading) {
            scoreElement = (
                <Progress className="score missing" animated value={percentage}>
                    <span>...</span>
                </Progress>
            )
        }
        else if (score !== undefined) {
            let className = "score"

            if (percentage >= Math.trunc(100 * props.maxScore)) {
                className += " bolded"
            }

            let colour = computeColour(percentage)

            scoreElement = <Progress className={className} color={colour} value={percentage}>
                <span>{percentage}%</span>
            </Progress>
        }

        return scoreElement
    }

    let d = props.detail

    return (
        <div className="energy-container">
            <div className="energy-container-cell">
                <span>{d.heading}</span>

                {renderEnergyBar(d.score)}
            </div>

            {props.showDescription && <div className="energy-description">
                <span>{d.description}</span>
            </div>}
        </div>
    )
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
