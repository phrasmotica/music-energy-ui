import { useState } from "react"
import { Collapse, Progress } from "reactstrap"
import { Button, Icon } from "semantic-ui-react"
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic"

interface EnergyBarProps {
    detail: {
        heading: string
        score: number | undefined
        description: string
    }

    loading: boolean
    maxScore: number
}

export const EnergyBar = (props: EnergyBarProps) => {
    const [showDescription, setShowDescription] = useState(false)

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
        else if (score) {
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

    let iconName: SemanticICONS = showDescription ? "chevron up" : "chevron down"

    return (
        <div className="energy-container">
            <div className="energy-container-cell">
                <span>{d.heading}</span>

                <div className="description-button">
                    <Button icon compact onClick={() => setShowDescription(!showDescription)}>
                        <Icon fitted name={iconName} />
                    </Button>
                </div>

                {renderEnergyBar(d.score)}
            </div>

            <Collapse isOpen={showDescription}>
                <div className="energy-description">
                    <span>{d.description}</span>
                </div>
            </Collapse>
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
