import { useState } from "react"

export const Display = () => {
    const [displayUrl, setrDisplayUrl] = useState("http://localhost:8000")
    const [showDisplay, setShowDisplay] = useState(false);
    return (
        <>
            {showDisplay ? 
            <>
                <button onClick={() => setShowDisplay(false)}>Close Output!</button>
                <button onClick={() => window.open(displayUrl, '_blank')}>New Window</button>
                <iframe title="displayFrame" src={displayUrl} style={{width: "100%", height: "100%"}}> </iframe>
            </>
            : <button onClick={() => setShowDisplay(true)}>Show Output!</button>}
        </>
    )
}