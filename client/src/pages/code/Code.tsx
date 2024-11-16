import "../../static/css/code.css";
import {TerminalComponent} from "./TerminalComponent";
export const Code = () => {
    return (
        <div className="grid-container">
            <div className="grid-item grid-item-files">1</div>
            <div className="grid-item grid-item-coding">2</div>
            <div className="grid-item grid-item-output">3</div>
            <div className="grid-item grid-item-terminal"><TerminalComponent/></div>
        </div>
    )
}