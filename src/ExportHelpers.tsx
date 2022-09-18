import html2canvas from "html2canvas"
import moment from "moment"
import { Params } from "react-component-export-image"

import { TrackEnergyResponse } from "./TrackEnergyResponse"

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

export const createExportParams = (trackData: TrackEnergyResponse) => ({
    fileName: createFileName(trackData),

    // ensures exported images do not have extra padding on the left
    // https://github.com/im-salman/react-component-export-image/issues/36#issuecomment-769225313
    html2CanvasOptions: {
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
    }
}) as Params

export const copyToClipboard = (onCopy: () => void, onFail: () => void) => {
    const element = document.getElementById("shareable")!

    html2canvas(element)
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
