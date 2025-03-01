import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useState, useEffect } from "react";
import { useSaveFile } from "../../api/service";
import { useStompClient } from 'react-stomp-hooks';

export const Editor = ({ fileUrl, filePath, projectType }: any) => {
    const [fileContent, setFileContent] = useState("");
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
        saveFile();
    }

    const runProject = () => {
        if(projectType === "React js") {
            let pathToPackage = filePath;
            let len: number = pathToPackage.length;
            for(len = pathToPackage.length-1;len>=0;len--){
                if(pathToPackage[len] === "/"){
                    pathToPackage = pathToPackage.slice(0,len);
                    break;
                }
            }
            
            stompClient?.publish({ destination: '/app/runFile', 
                body: JSON.stringify({projectType: projectType, path: filePath, command: `\u0003;cd ${pathToPackage};export PATH=$PATH:$(npm root -g);npm install --save-dev web-vitals;PORT=8000 npm run start`}) 
            });
        }else if(projectType === "Python"){
            stompClient?.publish({ 
                destination: '/app/runFile', 
                body: JSON.stringify({projectType: projectType, path: filePath, command: "python3"})
            });
        }else if(projectType === "javascript"){
            stompClient?.publish({ 
                destination: '/app/runFile', 
                body: JSON.stringify({projectType: projectType, path: filePath, command: "node"})
            });
        }else{

        }
    }

    return (
        <>
            <h2 style={{ color: "#007bff", fontSize: "20px", fontWeight: "bold" }}>{filePath.replaceAll("/"," > ")}</h2>
            <button onClick={() => handleSaveFile()} > Save </button>
            <button onClick={() => runProject()} > Run </button>
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
