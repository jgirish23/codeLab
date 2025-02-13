import { useState } from "react"

export const Display = () => {
    const [displayUrl, setrDisplayUrl] = useState("http://localhost:8000")

    return (
        <>
            <button onClick={() => window.open(displayUrl, '_blank')}>New Window</button>
            <iframe src={displayUrl} style={{width: "100%", height: "100%"}}> </iframe>
        </>
    )
}