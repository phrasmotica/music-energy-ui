import QRCode from "react-qr-code"

export const Watermark = () => {
    const link = process.env.REACT_APP_WEBSITE_LINK

    if (!link) {
        return null
    }

    return (
        <div className="watermark">
            <div className="qr-code-container">
                <QRCode
                    id="qr-code"
                    value={link}
                    size={128} />
            </div>

            <div>
                <span>{link}</span>
            </div>
        </div>
    )
}
