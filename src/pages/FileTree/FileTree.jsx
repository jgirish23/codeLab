import { useEffect, useState } from "react";
import { useFileTree } from "../../api/service";
import { FileTreeNode } from "./FileTreeNode";

export const FileTree = ({ setFileUrl, setFilePath, filePath, projectId }) => {
    const { mutateAsync: fetchFileTree, status, isSuccess } = useFileTree();
    const [fileStructure, setFileStructure] = useState(null);
    const [projectName, setProjectName] = useState([]);

    // Fetch data only once when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchFileTree("/project/" + projectId);
                setProjectName(Object.keys(data))
                setFileStructure(data[Object.keys(data)[0]]); // Store data in state
            } catch (error) {
                console.error("Error fetching file tree:", error);
            }
        };

        fetchData();
    }, [fetchFileTree]); // Runs only when `fetchFileTree` changes (which is never in normal cases)

    return (
        <div className="filetree-container">
            <div className="filetree-header">
                <div className="breadcrumbs">
                    <span className="breadcrumb-item">
                        <span className="breadcrumb-active">Workspace</span>
                    </span>
                </div>
            </div>
            <div className="filetree-workspace">
                {status === "pending" ? (
                    <div className="filetree-loading">Loading...</div>
                ) : !fileStructure ? (
                    <div className="filetree-loading">No data available</div>
                ) : (
                    <FileTreeNode
                        fileName={projectName}
                        currentFilePath={"project/"}
                        nodes={fileStructure}
                        setFileUrl={setFileUrl}
                        setFilePath={setFilePath}
                        activeFilePath={filePath}
                    />
                )}
            </div>
        </div>
    );
};
