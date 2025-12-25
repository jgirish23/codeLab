import React, { useState } from "react";
import { useFile } from "../../api/service";
import { useFileTree } from "../../api/service";
import "../../common/styles/FileTree.css";

export const FileTreeNode = ({ fileName, nodes, setFileUrl, setFilePath, currentFilePath }) => {
    const { mutateAsync: getFile } = useFile();
    const { mutateAsync: fetchFileTree, status } = useFileTree();
    const [expandedNodes, setExpandedNodes] = useState({}); // Store fetched directories
    const [subDir, setSubDir] = useState({}); // Store fetched directories
    
    const getFiles = async (filePath) => {
        const blob = await getFile(filePath);
        const blobUrl = URL.createObjectURL(blob);
        setFileUrl(blobUrl);
        setFilePath(filePath);
    };

    const callFetchSubDir = async (filePath) =>{
        //Fetch new directory data
        const data = await fetchFileTree(filePath);
        
        const extractedData = data[Object.keys(data)[0]]; // Extract inner structure
        const clone =  JSON.parse(JSON.stringify(extractedData));
        
        return clone;
    }

    const getDirs = async (filePath) => {
        if(subDir[filePath]){
            setSubDir({[filePath]:false});
            return;
        }
        //Fetch new directory data
        const extractedData = await callFetchSubDir(filePath);
       
        localStorage.setItem(filePath,JSON.stringify(extractedData));

        //Not working
        setExpandedNodes(extractedData);
         
        setSubDir({[filePath]:true});
    };

    if(status === "pending") return <h1>Loading...</h1>;

    return (
        <div className="FileTreeNode">
            <p className={nodes ? "" : "file-node"}>{fileName}</p>
            {nodes && (
                <ul id="FileTree_ul">
                    {Object.keys(nodes).map((child) => (
                        <li id="FileTree_li" key={child}>
                            {
                            nodes[child] ? 
                            <>
                                <p id={currentFilePath + `${child}`} className="File_Directory" onClick={() => getDirs(currentFilePath + `${child}`)}>
                                    {child}
                                </p>
                                {subDir[currentFilePath + `${child}`] && <FileTreeNode 
                                    fileName={""}
                                    nodes={JSON.parse(localStorage.getItem(currentFilePath + `${child}`))}
                                    setFileUrl={setFileUrl}
                                    setFilePath={setFilePath}
                                    currentFilePath={currentFilePath + `${child}/`}
                                />
                                }
                            </>
                             : 
                                <p className="File_node" onClick={() => getFiles(currentFilePath + `${child}`)}
                                >
                                    {child}
                                </p>
                            
                            }
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};