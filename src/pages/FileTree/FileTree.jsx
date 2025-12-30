import { useEffect, useState } from "react";
import { useFileTree } from "../../api/service";
import { FileTreeNode } from "./FileTreeNode";

export const FileTree = ({ setFileUrl, setFilePath, projectId }) => {
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

    if (status === "pending") return <h1>Loading...</h1>;
    if (!fileStructure) return <h1>No data available</h1>;

    return (
        <FileTreeNode
            fileName={projectName}
            currentFilePath={"project/"}
            nodes={fileStructure}
            setFileUrl={setFileUrl}
            setFilePath={setFilePath}
        />
    );
};
