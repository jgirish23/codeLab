import { useState } from "react"

export const Display = (props: {setRowHeight: React.Dispatch<React.SetStateAction<string>>}) => {
    const [displayUrl, setrDisplayUrl] = useState("http://localhost:8000")
    const [showDisplay, setShowDisplay] = useState(false);
    // (document.getElementsByClassName("grid-container")[0] as HTMLElement).style.gridTemplateRows = "10% 90%";
    return (
        <>
            {showDisplay ? 
            <>
                <button onClick={() => {setShowDisplay(false);props.setRowHeight("5% 95%");}}>Close Output!</button>
                <button onClick={() => window.open(displayUrl, '_blank')}>New Window</button>
                <iframe title="displayFrame" src={displayUrl} style={{width: "100%", height: "95%"}}> </iframe>
            </>
            : <button onClick={() => {setShowDisplay(true);props.setRowHeight("50% 50%");}}>Show Output!</button>}
        </>
    )
}