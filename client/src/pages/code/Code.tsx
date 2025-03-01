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
    const state = location.state;
    const projectType = state.projectType;
    const projectId = state.projectId;
    const {isPending, isFetching, isLoading, isSuccess} = useCreateSampleTemplate("sample-template", projectId, projectType);

    if (!isSuccess) {
        if(isPending){
            return <p>Pending...</p>
        }else if(isFetching){
            return <p>Fetching...</p>
        }else if(isLoading){
            return <p>Loading...</p>
        }
    }
    return (
        <div className="grid-container">
            <div className="grid-item grid-item-files"><FileTree setFileUrl={setFileUrl} setFilePath={setFilePath} projectId={projectId}/></div>
            <div className="grid-item grid-item-coding"><Editor fileUrl={fileUrl} filePath={filePath} projectType={state.projectName}/></div>
            <div className="grid-item grid-item-output"><Display/></div>
            <div className="grid-item grid-item-terminal"><TerminalComponent/></div>
        </div>
    )
}