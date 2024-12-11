
import React from 'react'
import axios from 'axios'
import BASE_URL from '../BASE_URL'
import { useState, useEffect } from 'react'
const TableDashboard = () => {

    const [segment, setSegment] = useState();
    const [score, setScore] = useState();

    const [tablescore, setTableScore] = useState([])

    const getScore = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/Tablescore`);
            setTableScore(response.data); 
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching scores:', error);
        }
    };

    useEffect(() => {
        getScore();
    }, []);

  return (
    <div >
        <div>
            <div className='flex justify-center xs:w-screen sm:w-screen lg:w-full '>
                <tr>
                    <td colSpan="3" className="py-2  px-4 text-gray-800 ">
                        <table className=" bg-white rounded-lg shadow-md ">
                            <thead className="bg-gray-200">
                                <tr className=''>
                                    <th className="py-2 px-2 text-center">Segment</th>
                                    <th className="py-2 px-2 text-center">Scores</th>
                                    <th className="py-2 px-2 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                tablescore.map((tablescore) => (
                                    <tr key={tablescore._id}>
                                        <td className="py-2 px-2 text-center">
                                            <input
                                            type='text'
                                            className='text-center'
                                            value={tablescore.Segment}
                                            // disabled="true"
                                            >
                                                
                                                </input>
                                                </td>
                                        <td className="py-2 px-2 text-center">{tablescore.Scores}</td>
                                        <td className="py-2 px-14 text-center">
                                            <button className="py-2 px-4 text-gray-800 bg-white rounded-lg shadow-md">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                            ))}
                            </tbody>
                        </table>
                    </td>
                </tr>
            </div>
            {/* <button className="py-2 px-60 text-gray-800 min-w-full bg-white rounded-lg shadow-md">
                + Add segment
            </button> */}
        </div>
    </div>
  )
}

export default TableDashboard