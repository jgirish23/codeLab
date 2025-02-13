import { useLocation } from "react-router-dom";
import "../../static/css/Code.css";
import { FileTree } from "./FileTree";
import {TerminalComponent} from "./TerminalComponent";
import { Editor } from "./Editor";
import { useState } from "react";
import {Display} from "./Display"

export const Code = () => {
    const [fileUrl, setFileUrl] = useState("");
    const [filePath, setFilePath] = useState("");

    const location = useLocation()
    const state = location.state;
    // {state.projectName}
    return (
        <div className="grid-container">
            <div className="grid-item grid-item-files"><FileTree setFileUrl={setFileUrl} setFilePath={setFilePath}/></div>
            <div className="grid-item grid-item-coding"><Editor fileUrl={fileUrl} filePath={filePath}/></div>
            <div className="grid-item grid-item-output"><Display/></div>
            <div className="grid-item grid-item-terminal"><TerminalComponent/></div>
        </div>
    )
}