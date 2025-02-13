import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useState, useEffect } from "react";
import { useSaveFile } from "../../api/service";
import { useStompClient } from 'react-stomp-hooks';

export const Editor = ({ fileUrl, filePath }: any) => {
    const [fileContent, setFileContent] = useState("");
    // const formattedText = fileContent.replace(/\n/g, "\r\n"); // Ensure new lines are handled correctly
    const {mutateAsync: saveFile } = useSaveFile(fileContent, filePath );
    const stompClient = useStompClient();
    const [fileStatus, setFileStatus] = useState(true);

    useEffect(() => {
        if (!fileUrl) return;

        const fetchFileContent = async () => {
            try {
                const response = await fetch(fileUrl).then(res => {
                    setFileStatus(false);
                    return res.text();
                });
                
                // const text = await response.text();
                setFileContent(response);
            } catch (error) {
                console.error("Error loading file:", error);
            }
        };

        fetchFileContent();

        return () => URL.revokeObjectURL(fileUrl);
    }, [fileUrl]);

    const handleSaveFile = () => {
        console.log("saving ...");
        saveFile();
    }

    const runProject = () => {
        console.log("Running ...");
        stompClient?.publish({ destination: '/app/execute', body: "\u0003;export PATH=$PATH:$(npm root -g);cd del/app;npm install --save-dev web-vitals;PORT=8000 npm run start" });
        // stompClient?.publish({ destination: '/app/execute', body: "export PATH=$PATH:$(npm root -g)\r"});
        // stompClient?.publish({ destination: '/app/execute', body: "cd del/app\r" });
        // stompClient?.publish({ destination: '/app/execute', body: "PORT=8000 npm run start\r" });
    }

    return (
        <>
            <h2>{filePath.replaceAll("/"," > ")}</h2>
            <button onClick={() => handleSaveFile()} > Save </button>
            <button onClick={() => runProject()} > Run </button>
            {fileStatus && <h1>Geting file content.....</h1>}
            <AceEditor
                mode="javascript"
                theme="github"
                onChange={setFileContent}
                value={fileContent}
                name="editor"
                editorProps={{ $blockScrolling: true }}
                setOptions={{ useWorker: false }}
                fontSize={14}
                style={{ width: "100%", height: "90%" }}
            />
        </>
    );
};
