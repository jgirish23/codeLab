import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import { useEffect, useState } from "react";
import { useSharedWebSocket } from "../../global/utils/WebSocketProvider";
import { useRunFile, useSaveFile } from "../../api/service";
import { projectTypes } from "../../global/ProjectTypes/ProjectTypes";
import "./Editor.css";

interface EditorProps {
    fileUrl: string;
    filePath: string;
    projectType: typeof projectTypes[0];
}

export const Editor: React.FC<EditorProps> = ({
    fileUrl,
    filePath,
    projectType,
}) => {
    const [fileContent, setFileContent] = useState<string>("");
    const { ws, ready } = useSharedWebSocket();
    const { mutateAsync: saveFile } = useSaveFile(fileContent, filePath);
    const { mutate: mutateRunFile } = useRunFile();

    useEffect(() => {
        if (!fileUrl) return;

        fetch(fileUrl)
            .then((r) => r.text())
            .then(setFileContent);
    }, [fileUrl]);

    const runProject = () => {
        if (!ws || !ready) return;
        // stop current process
        // ws.send("\u0003");

        let command = "";
        if (projectType === "React js") {
            let pathToPackage = filePath;
            for (let i = pathToPackage.length - 1; i >= 0; i--) {
                if (pathToPackage[i] === "/") {
                    pathToPackage = pathToPackage.slice(0, i);
                    break;
                }
            }

            command = JSON.stringify({
                projectType: projectType,
                path: filePath,
                command: `\u0003;cd */*/*/app;export PATH=$PATH:$(npm root -g);npm install --save-dev web-vitals;PORT=8000 npm run start`,
            });
        } else if (projectType === "Python") {
            command = JSON.stringify({ projectType: projectType, path: filePath, command: "python3" });
        } else if (projectType === "javascript") {
            command = JSON.stringify({ projectType: projectType, path: filePath, command: "node" });
        }

        if (command) mutateRunFile(command);
    };

    const pathSegments = filePath.split("/").filter(Boolean);

    return (
        <div className="editor-container">
            <div className="editor-header">
                <div className="breadcrumbs">
                    {pathSegments.map((segment, index) => {
                        const isLast = index === pathSegments.length - 1;
                        return (
                            <span key={index} className="breadcrumb-item">
                                {index > 0 && <span className="breadcrumb-separator">/</span>}
                                <span className={isLast ? "breadcrumb-active" : "breadcrumb-parent"}>
                                    {segment}
                                </span>
                            </span>
                        );
                    })}
                </div>

                <div className="editor-actions">
                    <button className="editor-btn btn-save" onClick={() => saveFile()}>
                        <svg className="btn-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        Save
                    </button>
                    <button className="editor-btn btn-run" onClick={() => runProject()}>
                        <svg className="btn-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Run
                    </button>
                </div>
            </div>

            <div className="editor-workspace">
                <AceEditor
                    mode="javascript"
                    theme="monokai"
                    value={fileContent}
                    onChange={setFileContent}
                    width="100%"
                    height="100%"
                    fontSize={14}
                    setOptions={{ useWorker: false }}
                />
            </div>
        </div>
    );
};
