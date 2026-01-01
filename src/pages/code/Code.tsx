import { useLocation } from "react-router-dom";
import "../../global/static/css/Code.css";
import { FileTree } from "../FileTree/FileTree";
import {TerminalComponent} from "../Terminal/TerminalComponent";
import { Editor } from "../Editor/Editor";
import {useEffect, useState} from "react";
import {Display} from "../Display/Display"
import {useCreateSampleTemplate, useStartContainer} from "../../api/service";
import {ScreenLoader} from "../../global/utils/ScreenLoader";
import {WebSocketProvider} from "../../global/utils/WebSocketProvider";


export const Code = () => {
    const [fileUrl, setFileUrl] = useState("");
    const [filePath, setFilePath] = useState("");
    const location = useLocation()
    const [rowHeight, setRowHeight] = useState("5% 95%");
    const [enable, setEnable] = useState(false);
    const state = location.state;
    const projectType = state.projectType;
    const projectId = state.projectId;
    localStorage.setItem('projectId', projectId)
    const {isLoading: isStartContainerLoading} = useStartContainer(projectId);
    const {isPending: isCreateTemplatePending, isFetching: isCreateTemplateFetching, isLoading: isCreateTemplateLoading, isSuccess: isCreateTemplateSuccess, data, refetch: refetchCreateTemplate} = useCreateSampleTemplate("sample-template", projectId, projectType);

    useEffect(() => {
        if (!isStartContainerLoading) {
            const timer = setTimeout(() => {
                refetchCreateTemplate()
            }, 10000)

            return () => clearTimeout(timer)
        }
    }, [isStartContainerLoading, refetchCreateTemplate])


    useEffect(() => {
        if (isCreateTemplateSuccess) {
            const timer = setTimeout(() => {
                setEnable(true);
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [isCreateTemplateSuccess])

    return (
        <>
            <ScreenLoader enable={isCreateTemplateFetching || isCreateTemplatePending || isCreateTemplateLoading || isStartContainerLoading}/>
            {enable ? <WebSocketProvider><div className="grid-container" style={{gridTemplateRows: rowHeight}}>
                <div className="grid-item grid-item-files"><FileTree setFileUrl={setFileUrl} setFilePath={setFilePath}
                                                                     projectId={projectId}/></div>
                <div className="grid-item grid-item-coding"><Editor fileUrl={fileUrl} filePath={filePath}
                                                                    projectType={state.projectName}/></div>
                <div className="grid-item grid-item-output"><Display setRowHeight={setRowHeight}/></div>
                <div className="grid-item grid-item-terminal"><TerminalComponent/></div>
            </div></WebSocketProvider>: null}
        </>
    )
}