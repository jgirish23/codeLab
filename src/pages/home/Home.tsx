import { useState } from "react";
import { ProjectTypes as options, projectTypes, sampleTemplateNames } from "../../global/ProjectTypes/ProjectTypes";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';



export const Home = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [codelabId, setCodelabId] = useState('');
    // const notify = () => toast('Wow so easy !');
    const navigate = useNavigate();

    const handleSelectedValue = () => {
        if (!codelabId || !selectedValue) {
            return toast.error('Select Project name and Type !');
        }
        localStorage.setItem('projectId', codelabId);
        localStorage.setItem("projectType", sampleTemplateNames[Number(selectedValue) - 1]);
        localStorage.setItem("projectName", projectTypes[Number(selectedValue) - 1]);
        navigate(`/codelab`);
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "2rem" }}>
            <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3rem", width: "100%", maxWidth: "600px" }}>
                <h2 className="text-gradient" style={{ fontSize: "2rem", marginBottom: "1rem", textAlign: "center" }}>Welcome to CodeLab</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "2.5rem", textAlign: "center" }}>
                    Where you can learn coding without any auto-generated code or AI-assisted completion. Sharpen your skills, understand the logic, and become a true coder! 🚀
                </p>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <input
                        id="projectId"
                        className="modern-input"
                        placeholder="Name the Project..."
                        onChange={(e) => setCodelabId(e.target.value)}
                    />

                    <select
                        className="modern-input modern-select"
                        value={selectedValue}
                        onChange={(e) => setSelectedValue(e.target.value)}
                    >
                        <option value="" disabled>Select Project Type</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value} style={{ background: "var(--bg-secondary)" }}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                </div>

                <ToastContainer theme="dark" />

                <button
                    id="submitProject"
                    className="btn-primary"
                    style={{ marginTop: "2.5rem", width: "100%" }}
                    type="button"
                    disabled={!selectedValue || !codelabId}
                    onClick={() => handleSelectedValue()}
                >
                    Start Coding
                </button>
            </div>
        </div>
    )
}