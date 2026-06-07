import React, { useState } from "react";
import { useFile } from "../../api/service";
import { useFileTree } from "../../api/service";
import "../../common/styles/FileTree.css";

const ChevronIcon = ({ isOpen }) => (
    <svg 
        className={`node-icon chevron-icon ${isOpen ? 'open' : ''}`} 
        viewBox="0 0 24 24" 
        width="14" 
        height="14" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        style={{ 
            transition: 'transform 0.15s ease', 
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            marginRight: '2px',
            color: 'var(--text-secondary)',
            display: 'inline-block'
        }}
    >
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

const FolderIcon = ({ isOpen }) => (
    <svg 
        className={`node-icon folder-icon ${isOpen ? 'open' : ''}`} 
        viewBox="0 0 24 24" 
        width="16" 
        height="16" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ 
            marginRight: '6px',
            color: '#f59e0b',
            display: 'inline-block'
        }}
    >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
);

const FileIcon = () => (
    <svg 
        className="node-icon file-icon" 
        viewBox="0 0 24 24" 
        width="16" 
        height="16" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ 
            marginRight: '6px',
            color: 'var(--text-secondary)',
            display: 'inline-block'
        }}
    >
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
        <polyline points="13 2 13 9 20 9"></polyline>
    </svg>
);

export const FileTreeNode = ({ fileName, nodes, setFileUrl, setFilePath, currentFilePath, activeFilePath }) => {
    const { mutateAsync: getFile } = useFile();
    const { mutateAsync: fetchFileTree, status } = useFileTree();
    const [childNodes, setChildNodes] = useState({}); // Store fetched subdirectory structures
    const [subDir, setSubDir] = useState({}); // Track which directories are expanded

    const getFiles = async (filePath) => {
        const blob = await getFile(filePath);
        const blobUrl = URL.createObjectURL(blob);
        setFileUrl(blobUrl);
        setFilePath(filePath);
    };

    const callFetchSubDir = async (filePath) => {
        // Fetch new directory data
        const data = await fetchFileTree(filePath);

        const extractedData = data[Object.keys(data)[0]]; // Extract inner structure
        const clone = JSON.parse(JSON.stringify(extractedData));

        return clone;
    }

    const getDirs = async (filePath) => {
        if (subDir[filePath]) {
            setSubDir({ [filePath]: false });
            return;
        }

        // If we already have the directory's content in state, we don't need to fetch it again
        if (childNodes[filePath]) {
            setSubDir({ [filePath]: true });
            return;
        }

        // Fetch new directory data
        const extractedData = await callFetchSubDir(filePath);

        setChildNodes((prev) => ({
            ...prev,
            [filePath]: extractedData,
        }));

        setSubDir({ [filePath]: true });
    };

    if (status === "pending") return <span className="filetree-inline-loading">Loading...</span>;

    return (
        <div className="FileTreeNode">
            {fileName && fileName.length > 0 && (
                <p className="FileTree_Root">
                    <svg className="node-icon root-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#818cf8', marginRight: '6px' }}>
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{fileName}</span>
                </p>
            )}
            {nodes && (
                <ul id="FileTree_ul">
                    {Object.keys(nodes).map((child) => (
                        <li id="FileTree_li" key={child}>
                            {
                                nodes[child] ?
                                    <>
                                        <p id={currentFilePath + `${child}`} className="File_Directory" onClick={() => getDirs(currentFilePath + `${child}`)}>
                                            <ChevronIcon isOpen={!!subDir[currentFilePath + `${child}`]} />
                                            <FolderIcon isOpen={!!subDir[currentFilePath + `${child}`]} />
                                            <span>{child}</span>
                                        </p>
                                        {subDir[currentFilePath + `${child}`] && <FileTreeNode
                                            fileName={""}
                                            nodes={childNodes[currentFilePath + `${child}`]}
                                            setFileUrl={setFileUrl}
                                            setFilePath={setFilePath}
                                            currentFilePath={currentFilePath + `${child}/`}
                                            activeFilePath={activeFilePath}
                                        />
                                        }
                                    </>
                                    :
                                    <p className={`File_node ${activeFilePath === (currentFilePath + child) ? 'active' : ''}`} onClick={() => getFiles(currentFilePath + `${child}`)}
                                    >
                                        <FileIcon />
                                        <span>{child}</span>
                                    </p>

                            }
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};