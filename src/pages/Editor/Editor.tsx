import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import { useEffect, useState } from "react";
import { useSharedWebSocket } from "../../global/utils/WebSocketProvider";
import {useRunFile, useSaveFile} from "../../api/service";

interface EditorProps {
    fileUrl: string;
    filePath: string;
    projectType: "React js" | "Python" | "javascript";
}

export const Editor: React.FC<EditorProps> = ({
                                                  fileUrl,
                                                  filePath,
                                                  projectType,
                                              }) => {
    const [fileContent, setFileContent] = useState<string>("");
    const { ws, ready, instance } = useSharedWebSocket();
    const { mutateAsync: saveFile } = useSaveFile(fileContent, filePath);
    const {mutate: mutateRunFile, isSuccess: isRunFileSuccess} = useRunFile();

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

    return (
        <>
            <h3>{filePath.replaceAll("/", " > ")}</h3>

            <button onClick={() => saveFile()}>Save</button>
            <button onClick={() => runProject()}>Run</button>

            <AceEditor
                mode="javascript"
                theme="github"
                value={fileContent}
                onChange={setFileContent}
                width="100%"
                height="90%"
                fontSize={14}
                setOptions={{ useWorker: false }}
            />
        </>
    );
};
