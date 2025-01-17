import { useLocation } from "react-router-dom";
import "../../static/css/code.css";
import {TerminalComponent} from "./TerminalComponent";
export const Code = () => {
    const location = useLocation()
    const state = location.state;

    return (
        <div className="grid-container">
            <div className="grid-item grid-item-files">1</div>
            <div className="grid-item grid-item-coding">{state.projectName}</div>
            <div className="grid-item grid-item-output">3</div>
            <div className="grid-item grid-item-terminal"><TerminalComponent/></div>
        </div>
    )
}