import { useLocation } from "react-router-dom";
import "../../static/css/code.css";
import {TerminalComponent} from "./TerminalComponent";
import {SocketConn} from "./SocketConn";

export const Code = () => {
    const location = useLocation();
    const item = location.state;

    return (
        <div className="grid-container">
            <div className="grid-item grid-item-files"><h1>{item}</h1></div>
            <div className="grid-item grid-item-coding">2</div>
            <div className="grid-item grid-item-output"><SocketConn/></div>
            <div className="grid-item grid-item-terminal"><TerminalComponent/></div>
        </div>
    )
}