import { useLocation } from "react-router-dom";
import "../../global/static/css/Code.css";
import { FileTree } from "../FileTree/FileTree";
import {TerminalComponent} from "../Terminal/TerminalComponent";
import { Editor } from "../Editor/Editor";
import { useState } from "react";
import {Display} from "../Display/Display"
import { useCreateSampleTemplate } from "../../api/service";


export const Code = () => {
    const [fileUrl, setFileUrl] = useState("");
    const [filePath, setFilePath] = useState("");
    const location = useLocation()
    const [rowHeight, setRowHeight] = useState("5% 95%");
    const state = location.state;
    const projectType = state.projectType;
    const projectId = state.projectId;
    const {isPending, isFetching, isLoading, isSuccess, data} = useCreateSampleTemplate("sample-template", projectId, projectType);

    if (isFetching || isPending || isLoading) {
        
        return <p style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "25rem",color: "rgb(190, 176, 111)", font: "30px Arial bolder Georgia, serif",opacity: 0.5, borderRadius: "2rem", boxShadow: "0px 0px 5px #fff;"}}>Loading...</p>
        
    }

    return (
        <>
            <div className="grid-container" style={{gridTemplateRows: rowHeight}}>
                <div className="grid-item grid-item-files"><FileTree setFileUrl={setFileUrl} setFilePath={setFilePath} projectId={projectId}/></div>
                <div className="grid-item grid-item-coding"><Editor fileUrl={fileUrl} filePath={filePath} projectType={state.projectName}/></div>
                <div className="grid-item grid-item-output"><Display setRowHeight={setRowHeight}/></div>
                <div className="grid-item grid-item-terminal"><TerminalComponent/></div>
            </div>
        </>
    )
}