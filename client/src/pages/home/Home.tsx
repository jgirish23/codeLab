import { useState } from "react";
import {ProjectTypes as options } from "../../global/ProjectTypes/ProjectTypes";
import { useNavigate } from "react-router-dom";

const projectTypes: string[] = [
    "React js",
    "Python",
    "javascript",
]

const sampleTemplateNames: string[] = [
    "reactjs.zip",
    "py.zip",
    "js.zip",
]

const  handleSelectedValue = (selectedValue: string,navigate: any) => {
    navigate(`/codelab`,{state: {"projectName": projectTypes[Number(selectedValue)-1], "projectType": sampleTemplateNames[Number(selectedValue)-1]}});
}

export const Home = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const navigate = useNavigate();

    return (
        <div>
            {/* <h1>{data}</h1> */}
            <input placeholder="Name the Project" ></input>
            <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                    {option.text}
                    </option>
                ))}
            </select>
           
            <button type="button" onClick={() => handleSelectedValue(selectedValue,navigate)}>Select</button>
        </div>
    )
}