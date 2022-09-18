import html2canvas from "html2canvas"
import moment from "moment"

import { TrackEnergyResponse } from "./TrackEnergyResponse"

const createCanvas = () => {
    const element = document.getElementById("shareable")!

    return html2canvas(element, {
        backgroundColor: null,
        onclone: (_, element) => {
            element.className += " show-watermark"
        }
    })
}

const clean = (str: string) => str
    .trim()
    .toLowerCase()
    .split(new RegExp("\\W+")).join("-") // replace any sequence of non-alphabet characters with a hyphen

const createFileName = (trackData: TrackEnergyResponse) => {
    var artistCleaned = clean(trackData.artist)
    var nameCleaned = clean(trackData.name)
    var timestamp = moment().unix()

    return [artistCleaned, nameCleaned, timestamp].join("-")
}

const downloadImage = (blob: any, fileName: string) => {
    const fakeLink = document.createElement("a")

    // fakeLink.style = "display:none;"
    fakeLink.download = fileName

    fakeLink.href = blob

    document.body.appendChild(fakeLink)
    fakeLink.click()
    document.body.removeChild(fakeLink)

    fakeLink.remove()
}

export const saveAsPng = (trackData: TrackEnergyResponse) => {
    createCanvas()
    .then(canvas => canvas.toDataURL("image/png", 1.0))
    .then(blob => downloadImage(blob, createFileName(trackData)))
}

export const copyToClipboard = (onCopy: () => void, onFail: () => void) => {
    createCanvas()
    .then(canvas => canvas.toBlob(blob => {
        navigator.clipboard.write([
            new ClipboardItem({
                [blob!.type]: blob!
            })
        ])
        .then(onCopy)
        .catch(onFail)
    }))
}
