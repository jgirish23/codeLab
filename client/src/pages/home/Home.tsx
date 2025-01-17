import { useState } from "react";
import {ProjectTypes as options } from "../../global/ProjectTypes/ProjectTypes";
import {useTest} from "../../api/service";
import { useNavigate } from "react-router-dom";

const projectTypes = [
    "React js",
    "Python",
    "C++"
]

const  handleSelectedValue = (selectedValue:string,navigate:any) => {
    console.log('Selected Project:', selectedValue);  // Output: Selected Project: 1 for example
    console.log(`${projectTypes[Number(selectedValue)-1]}`);
    navigate(`/codelab`,{state: {"projectName":projectTypes[Number(selectedValue)-1]}});


}

export const Home = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const {isPending, error, data} = useTest();
    const navigate = useNavigate();

    // if (isPending) {
    //     return <p>Loading...</p>
    // }
    // console.log("data: " + data);
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