import { useState } from "react";
import {ProjectTypes as options } from "../../global/ProjectTypes/ProjectTypes";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const projectTypes: string[] = [
    "React js",
    "Python",
    "javascript",
]

const sampleTemplateNames: string[] = [
    "reactjs",
    "py",
    "js",
]

const  handleSelectedValue = (selectedValue: string,navigate: any, codelabId: string) => {
    if(!codelabId || !selectedValue){
        return toast.error('Select Project name and Type !');
    }
    navigate(`/codelab`,{state: {"projectId": codelabId, "projectName": projectTypes[Number(selectedValue)-1], "projectType": sampleTemplateNames[Number(selectedValue)-1]}});
}

export const Home = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [codelabId, setCodelabId] = useState('');
    // const notify = () => toast('Wow so easy !');
    const navigate = useNavigate();

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "10px", padding: "2rem",backgroundColor: "rgba(182, 172, 172, 0.5)" , boxShadow: "0 0 10px 0 rgba(0, 0, 0)", width: "50%", margin: "auto", marginTop: "10rem"}}>
            <p style={{backgroundColor: "rgba(255, 255, 255, 0)", color: "rgba(255, 255, 255, 1)", font: "18px Arial bolder Georgia, serif", margin: "20px auto", textAlign: "center"}}>Welcome to CodeLab – where you can learn coding without any auto-generated code or AI-assisted completion. Sharpen your skills, understand the logic, and become a true coder! 🚀</p>
            <input id="projectId" style={{width: "40%", backgroundColor: "rgba(255, 255, 255, 0.5)",font: "15px Arial bolder Georgia, serif", marginTop: "3rem", borderRadius: "0.9rem", textAlign: "center"}} placeholder="Name the Project" onChange={(e) => setCodelabId(e.target.value)}></input>
            <select style={{backgroundColor: "#282c34", width: "20%", marginTop: "2rem",color: "white", borderRadius: "0.9rem", textAlign: "center"}} value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                    {option.text}
                    </option>
                ))}
            </select>
            <ToastContainer />
    
    <button id="submitProject" style={{backgroundColor: "#282c34", width:"10%",color: "white",  marginTop: "2rem", borderRadius: "0.9rem", textAlign: "center"}} type="button" onClick={() => handleSelectedValue(selectedValue, navigate, codelabId)}>Select</button>
        </div>
    )
}