import { useEffect } from 'react'
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from "react-router-dom";
import BASE_URL from '../BASE_URL';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

// import accessToken from '../config/powerbi'
// import dataset_id from '../config/powerbi'
import axios from 'axios';
const Recency = () => {
  // {recency}    
    const [loading, setLoading] = useState(false);
    const [recencyRange, setRecencyRange] = useState({
        a: { min: 0, max: 0 },
        b: { min: 0, max: 0 },
        c: { min: 0, max: 0 },
        d: { min: 0, max: 0 },
        e: { min: 0 }
      });
    const [recencyDisplay, setRecencyDisplay] = useState({
        a: { min: 0, max: 0 },
        b: { min: 0, max: 0 },
        c: { min: 0, max: 0 },
        d: { min: 0, max: 0 },
    });

    const [recencyScore, setRecencyScore] = useState()
    const [userValueRecency, setuserValueRecency] = useState('')
    const [resultRecency, setResultRecency] = useState(null)
    const [error, setError] = useState(null);
    
//  GET request
const fetchRecencyData = async () =>{
  try {
    setLoading(true);
    const response = await axios.get(`${BASE_URL}/Recency`);
    if (response.data && response.data.length > 0) {
        const dataArray = response.data.map(item => {
            const category = item.Category.toLowerCase();
            const [min, max] = item.Range.includes('and above')
                ? [parseFloat(item.Range), null]
                : item.Range.split('-').map(num => parseFloat(num.trim()));
            return {
              category,
              min,
              max: max || min
            };
          })

          dataArray.sort((a,b) => a.min - b.min); 

          const transformedData = dataArray.reduce((acc, item) =>{
            acc[item.category] = {
              min: item.min,
              max: item.max === Infinity ? null : item.max
            };
            return acc;
          }, {});

          setRecencyRange(transformedData)
        }
        setError(null); 
} catch (err) {
    setError('Failed to fetch recency data');
    console.error('Error fetching data:', err);
    // Set default values if fetch fails
    setRecencyRange({
        a: { min: 0, max: 0 },
        b: { min: 0, max: 0 },
        c: { min: 0, max: 0 },
        d: { min: 0, max: 0 },
        e: { min: 0 }
      });
  } finally {
    setLoading(false);
  }

}
//  const fetchRecencyData = async () => {
//   try {
//       setLoading(true);
//       const response = await axios.get(`${BASE_URL}/Recency`);
//       if (response.data && response.data.length > 0) {
//           const transformedData = response.data.reduce((acc, item) => {
//               const category = item.Category.toLowerCase();
//               const [min, max] = item.Range.includes('and above') 
//                   ? [parseFloat(item.Range), null]
//                   : item.Range.split('-').map(num => parseFloat(num.trim()));
              
//               acc[category] = { min, max: max || min };
//               return acc;
//           }, {});
//           setRecencyRange(transformedData);
//       }
//       setError(null);
//   } catch (err) {
//       setError('Failed to fetch recency data');
//       console.error('Error fetching data:', err);
//       // Set default values if fetch fails
//       setRecencyRange({
//           a: { min: 0, max: 0 },
//           b: { min: 0, max: 0 },
//           c: { min: 0, max: 0 },
//           d: { min: 0, max:0 },
//           e: { min: 0 }
          
//       });
//   } finally {
//       setLoading(false);
//   }
// };




// Handle PUT request for updating recency data
const handleRecencySubmit = async (e) =>{
  e.preventDefault();
  try{
    setLoading(true);
    
    const sortedEntries = Object.entries(recencyRange)
    .sort(([, a], [, b]) => a.min - b.min);
    
    const formattedRecencyData = sortedEntries.map(([category,value], index) =>{
      const isLastEntry = index === sortedEntries.length - 1;
      const nextValue = !isLastEntry ? sortedEntries[index + 1][1] : null;

      return{
        Category: category.toUpperCase(),
        Score: index + 1,
        Range: isLastEntry 
        ? `${value.min} and above` 
        : `${value.min} - ${nextValue.min}`
      }
    })

    const response = await axios.put(`${BASE_URL}/Recency`, formattedRecencyData);

    if(response.data){
      const dataArray = response.data.map(item =>{
        const category = item.Category.toLowerCase();
        const [min, max] = item.Range.includes('and above')
        ? [parseFloat(item.Range), null]
        : item.Range.split('-').map(num => parseFloat(num.trim()));

        return {
          category,
          min,
          max: max || min,
          score:item.Score
        }
      })

      dataArray.sort((a,b) =>a.min - b.min);

      const transformedData = dataArray.reduce((acc, item) =>{
        acc[item.category] = {
          min: item.min,
          max: item.max === Infinity ? null : item.max,
        };
        return acc;
      }, {});

      setRecencyRange(transformedData);
    }
    setError(null);
    refreshPowerbi();
  } catch (err){
    setError('Failed to update recency data');
    console.error('Error updating data:', err);
  } finally {
    setLoading(false);
  }
}

// const handleRecencySubmit = async (e) => {
//   e.preventDefault();
//   try {
//       setLoading(true);
//       const formattedRecencyData = Object.entries(recencyRange).map(([category, value]) => ({
//           Category: category.toUpperCase(),
//           Score: category === 'e' ? 5 : (1 - Object.keys(recencyRange).indexOf(category)),
//           Range: category === 'e' ? `${value.min} and above` : `${value.min} - ${value.max}`
//       }));

      
      
//       const response = await axios.put(`${BASE_URL}/Recency`, formattedRecencyData);
//       if (response.data) {
//           const transformedData = response.data.reduce((acc, item) => {
//               const category = item.Category.toLowerCase();
//               const [min, max] = item.Range.includes('and above') 
//                   ? [parseFloat(item.Range), null]
//                   : item.Range.split('-').map(num => parseFloat(num.trim()));
              
//               acc[category] = { min, max: max || min };
//               return acc;
//           }, {});
//           setRecencyRange(transformedData);
//       }
//       setError(null);
//   } catch (err) {
//       setError('Failed to update recency data');
//       console.error('Error updating data:', err);
//   } finally {
//       setLoading(false);
//   }
// };
// 

const [status, setStatus] = useState('');
const [jobId, setJobId] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const refreshPowerbi = async () => {
  try {
            const response = await axios.post('/refresh-dataset');
            setJobId(response.data.jobId);
            setStatus('Refresh triggered successfully');
            
            // Optional: Start polling for status
            if (response.data.jobId) {
                startStatusPolling(response.data.jobId);
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to refresh dataset');
        } finally {
            setIsLoading(false);
        }
    };

    const startStatusPolling = async (jobId) => {
      const checkStatus = async () => {
          try {
              const response = await axios.get(`/api/powerbi/refresh-status/${jobId}`);
              setStatus(`Refresh status: ${response.data.status}`);

              if (response.data.status === 'Completed') {
                  return true;
              }
              return false;
          } catch (error) {
              setError('Failed to check refresh status');
              return true;
          }
      };

      // Poll every 5 seconds until completed or error
      const pollInterval = setInterval(async () => {
          const shouldStop = await checkStatus();
          if (shouldStop) {
              clearInterval(pollInterval);
          }
      }, 5000);
  };

useEffect(() => {
  fetchRecencyData();
  refreshPowerbi();
}, []);
    
    const handleRecencyChange = async (category, field, value) => {
      const numValue = parseFloat(value);
      
      setRecencyRange(prev => {
        const newRecency = { ...prev };
      
        // Update the current category's value
        newRecency[category] = {
          ...newRecency[category],
          [field]: numValue
        };
        
        // If changing max value, update next category's min
      //   newRecency[category] = {
      //   ...newRecency[category],
      //   [field]: numValue
      // };
      
      if (field === 'max') {
        const categories = ['a', 'b', 'c', 'd', 'e'];
        const currentIndex = categories.indexOf(category);
        if (currentIndex < categories.length - 1) {
          const nextCategory = categories[currentIndex + 1];
          newRecency[nextCategory] = {
            ...newRecency[nextCategory],
            min: numValue
          };
        }
      }
      return newRecency;
    })
  };
  
  const determineRecencyCategory = (value) => {
    if (value <= recencyRange.a.min && value >= recencyRange.a.max) return { category: 'A', score: 1 };
    if (value <= recencyRange.b.min && value >= recencyRange.b.max) return { category: 'B', score: 2 };
      if (value <= recencyRange.c.min && value >= recencyRange.c.max) return { category: 'C', score: 3 };
      if (value <= recencyRange.d.min && value >= recencyRange.d.max) return { category: 'D', score: 4};
      if (value <= recencyRange.e.min) return { category: 'E', score: 5 };
      return null;
    };
        
    // {recency}
                
// ***************************************************************************************
    // {Frequency}
      const [ranges, setRanges] = useState({
        a: { min: 0, max: 0 },
        b: { min: 0, max: 0 },
        c: { min: 0, max: 0 },
        d: { min: 0, max: 0 },
        e: { min: 0 }  
      });
    
      const [range, setRange] = useState({
        a: { min: 0, max: 0 },
        b: { min: 0, max: 0 },
        c: { min: 0, max: 0 },
        d: { min: 0, max: 0 },
      });

    
      const [loadingFrequency,setFrequencyLoading ] = useState(false)
      const [userValue, setUserValue] = useState('');
      const [result, setResult] = useState(null);
      const [errorFrequency, setErrorFrequency] = useState(null)
      // GET request
      const fetchFrequencyData = async () => {
        try {
          setFrequencyLoading(true);
          const response = await axios.get(`${BASE_URL}/Frequency`);
          if (response.data && response.data.length > 0) {
            // First, transform the data into an array of objects with category and range
            const dataArray = response.data.map(item => {
              const category = item.Category.toLowerCase();
              const [min, max] = item.Range.includes('and above')
                ? [parseFloat(item.Range), Infinity]
                : item.Range.split('-').map(num => parseFloat(num.trim()));
              
              return {
                category,
                min,
                max: max || min
              };
            });
      
            // Sort the array based on min values
            dataArray.sort((a, b) => a.min - b.min);
      
            // Transform sorted array back to the original format
            const transformedData = dataArray.reduce((acc, item) => {
              acc[item.category] = {
                min: item.min,
                max: item.max === Infinity ? null : item.max
              };
              return acc;
            }, {});
      
            setRanges(transformedData);
          }
          setErrorFrequency(null);
        } catch (err) {
          setErrorFrequency('Failed to fetch recency data');
          console.error('Error fetching data:', err);
          // Set default values if fetch fails
          setRanges({
            a: { min: 0, max: 0 },
            b: { min: 0, max: 0 },
            c: { min: 0, max: 0 },
            d: { min: 0, max: 0 },
            e: { min: 0 }
          });
        } finally {
          setFrequencyLoading(false);
        }
      };

      //  const fetchFrequencyData = async () => {
//   try {
//       setFrequencyLoading(true);
//       const response = await axios.get(`${BASE_URL}/Frequency`);
//       if (response.data && response.data.length > 0) {
//           const transformedData = response.data.reduce((acc, item) => {
//               const category = item.Category.toLowerCase();
//               const [min, max] = item.Range.includes('and above') 
//                   ? [parseFloat(item.Range), null]
//                   : item.Range.split('-').map(num => parseFloat(num.trim()));
              
//               acc[category] = { min, max: max || min };
//               return acc;
//           }, {});
//           setRanges(transformedData);
//       }
//       setErrorFrequency(null);
//   } catch (err) {
//     setErrorFrequency('Failed to fetch recency data');
//       console.error('Error fetching data:', err);
//       // Set default values if fetch fails
//       setRanges({
//           a: { min: 0, max: 0 },
//           b: { min: 0, max: 0 },
//           c: { min: 0, max: 0 },
//           d: { min: 0, max:0 },
//           e: { min: 0 }
          
//       });
//   } finally {
//     setFrequencyLoading(false);
//   }
// };

// Handle PUT request for updating recency data
const handleFrequencySubmit = async (e) => {
  e.preventDefault();
  try {
    setFrequencyLoading(true);
    
    // Create array from ranges and sort by min value in ascending order
    const sortedEntries = Object.entries(ranges)
      .sort(([, a], [, b]) => a.min - b.min);

    // Map the sorted entries to the required format with ascending scores
    const formattedFrequencyData = sortedEntries.map(([category, value], index) => {
      const isLastEntry = index === sortedEntries.length - 1;
      const nextValue = !isLastEntry ? sortedEntries[index + 1][1] : null;

      return {
        Category: category.toUpperCase(),
        Score: index + 1,
        Range: isLastEntry
          ? `${value.min} and above`
          : `${value.min} - ${nextValue.min}`
      };
    });

    const response = await axios.put(`${BASE_URL}/Frequency`, formattedFrequencyData);
    
    if (response.data) {
      // Transform and sort response data
      const dataArray = response.data.map(item => {
        const category = item.Category.toLowerCase();
        const [min, max] = item.Range.includes('and above')
          ? [parseFloat(item.Range), Infinity]
          : item.Range.split('-').map(num => parseFloat(num.trim()));

        return {
          category,
          min,
          max: max || min,
          score: item.Score
        };
      });

      // Sort by min value in ascending order
      dataArray.sort((a, b) => a.min - b.min);

      // Convert back to object format
      const transformedData = dataArray.reduce((acc, item) => {
        acc[item.category] = {
          min: item.min,
          max: item.max === Infinity ? null : item.max
        };
        return acc;
      }, {});

      setRanges(transformedData);
    }
    setErrorFrequency(null);
    
  } catch (err) {
    setErrorFrequency('Failed to update recency data');
    console.error('Error updating data:', err);
  } finally {
    setFrequencyLoading(false);
  }
};

// const handleFrequencySubmit = async (e) => {
//   e.preventDefault();
//   try {
//     setFrequencyLoading(true);
//     // Create array from ranges and sort by min value
//     const sortedEntries = Object.entries(ranges)
//       .sort(([, a], [, b]) => a.min - b.min);

//     // Map the sorted entries to the required format
//     const formattedFrequencyData = sortedEntries.map(([category, value], index) => ({
//       Category: category.toUpperCase(),
//       Score: index + 1, // Score will now be based on the sorted position
//       Range: index === sortedEntries.length - 0
//         ? `${value.min} and above` 
//         : `${value.min} - ${value.max}`
//     }));
      
//     const response = await axios.put(`${BASE_URL}/Frequency`, formattedFrequencyData);
//     if (response.data) {
//       const transformedData = response.data.reduce((acc, item) => {
//         const category = item.Category.toLowerCase();
//         const [min, max] = item.Range.includes('and above') 
//           ? [parseFloat(item.Range), null]
//           : item.Range.split('-').map(num => parseFloat(num.trim()));
              
//         acc[category] = { min, max: max || min };
//         return acc;
//       }, {});
//       setRanges(transformedData);
//     }
//     setErrorFrequency(null);
//   } catch (err) {
//     setErrorFrequency('Failed to update recency data');
//     console.error('Error updating data:', err);
//   } finally {
//     setLoading(false);
//   }
// };
// *************************************************************************************
// const handleFrequencySubmit = async (e) => {
//   e.preventDefault();
//   try {
//     setFrequencyLoading(true);
//       const formattedFrequencyData = Object.entries(ranges).map(([category, value]) => ({
//           Category: category.toUpperCase(),
//           Score: category === 'e' ? 5 : (5 - Object.keys(ranges).indexOf(category)),
//           Range: category === 'e' ? `${value.min} and above` : `${value.min} - ${value.max}`
//       }));
      
//       formattedFrequencyData.sort((a, b) => a.Score - b.Score)
      
      
//       const response = await axios.put(`${BASE_URL}/Frequency`, formattedFrequencyData);
//       if (response.data) {
//           const transformedData = response.data.reduce((acc, item) => {
//               const category = item.Category.toLowerCase();
//               const [min, max] = item.Range.includes('and above') 
//                   ? [parseFloat(item.Range), null]
//                   : item.Range.split('-').map(num => parseFloat(num.trim()));
              
//               acc[category] = { min, max: max || min };
//               return acc;
//           }, {});
//           setRanges(transformedData);
//       }
//       setErrorFrequency(null);
//   } catch (err) {
//     setErrorFrequency('Failed to update recency data');
//       console.error('Error updating data:', err);
//   } finally {
//       setLoading(false);
//   }
// };

useEffect(() => {
  fetchFrequencyData();
}, []);
    
      
      const handleRangeChange = (category, field, value) => {
        const numValue = parseFloat(value);
        
        setRanges(prev => {
          const newRanges = { ...prev };
          
          
          newRanges[category] = {
            ...newRanges[category],
            [field]: numValue
          };
    
          
          if (field === 'max') {
            const categories = ['a', 'b', 'c', 'd', 'e'];
            const currentIndex = categories.indexOf(category);
            if (currentIndex < categories.length - 1) {
              const nextCategory = categories[currentIndex + 1];
              newRanges[nextCategory] = {
                ...newRanges[nextCategory],
                min: numValue
              };
            }
          }
    
          return newRanges;
        });
      };
    
      
      const determineCategory = (value) => {
        if (value >= ranges.a.min && value <= ranges.a.max) return { category: 'A', score: 1 };
        if (value >= ranges.b.min && value <= ranges.b.max) return { category: 'B', score: 2 };
        if (value >= ranges.c.min && value <= ranges.c.max) return { category: 'C', score: 3 };
        if (value >= ranges.d.min && value <= ranges.d.max) return { category: 'D', score: 4 };
        if (value >= ranges.e.min) return { category: 'E', score: 5 };
        return null;
      };
    
      // {Frequency}
// ***************************************************************************************
      // {Monetary}
      const [monetaryRange, setMonetaryRange] = useState({
        a: { min: 0, max: 0 },
        b: { min: 0, max: 0 },
        c: { min: 0, max: 0 },
        d: { min: 0, max: 0 },
        e: { min: 0 }
      });

      const [monetaryValue, setMonetaryValue] = useState({
        a: { min: 0, max: 0 },
        b: { min: 0, max: 0 },
        c: { min: 0, max: 0 },
        d: { min: 0, max: 0 },
      });

      const [loadingMonetary,setMonetaryLoading ] = useState(false)
      const [userValueMonetary, setUserValueMonetary] = useState('')
      const [resultMonetary, setResultMonetary] = useState(null)
      const [errorMonetary, setErrorMonetary] = useState(null)

// GET request
const fetchMonetaryData = async () => {
  try {
    setMonetaryLoading(true);
    const response = await axios.get(`${BASE_URL}/Monetary`);
    if (response.data && response.data.length > 0) {
      // Convert data to array format for sorting
      const dataArray = response.data.map(item => {
        const category = item.Category.toLowerCase();
        const [min, max] = item.Range.includes('and above')
          ? [parseFloat(item.Range), Infinity]
          : item.Range.split('-').map(num => parseFloat(num.trim()));
        
        return {
          category,
          min,
          max: max || min
        };
      });

      // Sort the array by minimum values in ascending order
      dataArray.sort((a, b) => a.min - b.min);

      // Convert sorted array back to required object format
      const transformedData = dataArray.reduce((acc, item) => {
        acc[item.category] = {
          min: item.min,
          max: item.max === Infinity ? null : item.max
        };
        return acc;
      }, {});

      setMonetaryRange(transformedData);
    }
    setErrorMonetary(null);
    
  } catch (err) {
    setErrorMonetary('Failed to fetch recency data');
    console.error('Error fetching data:', err);
    // Set default values if fetch fails
    setMonetaryRange({
      a: { min: 0, max: 0 },
      b: { min: 0, max: 0 },
      c: { min: 0, max: 0 },
      d: { min: 0, max: 0 },
      e: { min: 0 }
    });
  } finally {
    setMonetaryLoading(false);
  }
};

// const fetchMonetaryData = async () => {
//   try {
//     setMonetaryLoading(true);
//       const response = await axios.get(`${BASE_URL}/Monetary`);
//       if (response.data && response.data.length > 0) {
//           const transformedData = response.data.reduce((acc, item) => {
//               const category = item.Category.toLowerCase();
//               const [min, max] = item.Range.includes('and above') 
//                   ? [parseFloat(item.Range), null]
//                   : item.Range.split('-').map(num => parseFloat(num.trim()));
              
//               acc[category] = { min, max: max || min };
//               return acc;
//           }, {});
//           setMonetaryRange(transformedData);
//       }
//       setErrorMonetary(null);
//   } catch (err) {
//     setErrorMonetary('Failed to fetch recency data');
//       console.error('Error fetching data:', err);
//       // Set default values if fetch fails
//       setMonetaryRange({
//           a: { min: 0, max: 0 },
//           b: { min: 0, max: 0 },
//           c: { min: 0, max: 0 },
//           d: { min: 0, max:0 },
//           e: { min: 0 }
          
//       });
//   } finally {
//     setMonetaryLoading(false);
//   }
// };

// Handle PUT request for updating recency data
const handleMonetarySubmit = async (e) => {
  e.preventDefault();
  try {
    setMonetaryLoading(true);

    // Sort entries by min value in ascending order
    const sortedEntries = Object.entries(monetaryRange)
      .sort(([, a], [, b]) => a.min - b.min);

    // Map the sorted entries to the required format
    const formattedmonetaryData = sortedEntries.map(([category, value], index) => {
      const isLastEntry = index === sortedEntries.length - 1;
      const nextValue = !isLastEntry ? sortedEntries[index + 1][1] : null;

      return {
        Category: category.toUpperCase(),
        Score: index + 1, // Ascending scores (1,2,3,4,5)
        Range: isLastEntry
          ? `${value.min} and above`
          : `${value.min} - ${nextValue.min }`
      };
    });

    const response = await axios.put(`${BASE_URL}/Monetary`, formattedmonetaryData);
    
    if (response.data) {
      // Transform and sort response data
      const dataArray = response.data.map(item => {
        const category = item.Category.toLowerCase();
        const [min, max] = item.Range.includes('and above')
          ? [parseFloat(item.Range), Infinity]
          : item.Range.split('-').map(num => parseFloat(num.trim()));

        return {
          category,
          min,
          max: max || min,
          score: item.Score
        };
      });

      // Sort by min value in ascending order
      dataArray.sort((a, b) => a.min - b.min);

      // Convert back to object format
      const transformedData = dataArray.reduce((acc, item) => {
        acc[item.category] = {
          min: item.min,
          max: item.max === Infinity ? null : item.max
        };
        return acc;
      }, {});

      setMonetaryRange(transformedData);
    }
    setErrorMonetary(null);
  } catch (err) {
    setErrorMonetary('Failed to update recency data');
    console.error('Error updating data:', err);
  } finally {
    setMonetaryLoading(false);
  }
};

// const handleMonetarySubmit = async (e) => {
//   e.preventDefault();
//   try {
//     setMonetaryLoading(true);
//       const formattedmonetaryData = Object.entries(monetaryRange).map(([category, value]) => ({
//           Category: category.toUpperCase(),
//           Score: category === 'e' ? 1 : (5 - Object.keys(monetaryRange).indexOf(category)),
//           Range: category === 'e' ? `${value.min} and above` : `${value.min} - ${value.max}`
//       }));
      

//       const response = await axios.put(`${BASE_URL}/Monetary`, formattedmonetaryData);
//       if (response.data) {
//           const transformedData = response.data.reduce((acc, item) => {
//               const category = item.Category.toLowerCase();
//               const [min, max] = item.Range.includes('and above') 
//                   ? [parseFloat(item.Range), null]
//                   : item.Range.split('-').map(num => parseFloat(num.trim()));
              
//               acc[category] = { min, max: max || min };
//               return acc;
//           }, {});
//           setMonetaryRange(transformedData);
//       }
//       setErrorMonetary(null);
//   } catch (err) {
//     setErrorMonetary('Failed to update recency data');
//       console.error('Error updating data:', err);
//   } finally {
//     setMonetaryLoading(false);
//   }
// };

useEffect(() => {
  fetchMonetaryData();
}, []);




      const handleMonetaryChange = (category, field, value) => {
        const numValue = parseFloat(value);

      setMonetaryRange(prev =>{
        const newMonetary = { ...prev };


        newMonetary[category] = {
          ...newMonetary[category],
          [field]: numValue
        };

       

      if (field === 'max') {
        const categories = ['a', 'b', 'c', 'd', 'e'];
        const currentIndex = categories.indexOf(category);
        if (currentIndex < categories.length - 1) {
          const nextCategory = categories[currentIndex + 1];
          newMonetary[nextCategory] = {
            ...newMonetary[nextCategory],
            min: numValue
          };
        }
      }
      return newMonetary
      })
    };

      const determineMonetaryCategory = (value) => {
        if (value >= monetaryRange.a.min && value <= monetaryRange.a.max) return { category: 'A', score: 5};
        if (value >= monetaryRange.b.min && value <= monetaryRange.b.max) return { category: 'B', score: 4};
        if (value >= monetaryRange.c.min && value <= monetaryRange.c.max) return { category: 'C', score: 3};
        if (value >= monetaryRange.d.min && value <= monetaryRange.d.max) return { category: 'D', score: 2 };
        if (value >= monetaryRange.e.min) return { category: 'E', score: 1 };
        return null;
      };

      // {Monetary}
// ***************************************************************************************

return (
     <>
    <div className="w-full min-h-screen flex flex-col justify-start  overflow-x-hidden">
      {/* <div className="max-w-2xl mx-auto  p-6 bg-white rounded-lg shadow-lg"> */}
        <div className='flex justify-around xs:flex-col sm:flex-col lg:flex-row xs:mt-2  mt-3'>
          {/* {Recency} */}
          <div className='max-w-2xl mx-auto  p-6 bg-white rounded-lg shadow-lg'>
            <h2 className="text-2xl font-bold mb-4">Recency Score Range </h2>
              <form onSubmit={handleRecencySubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  {Object.keys(recencyDisplay).map((category, index) => (
                    <div key={category} className="grid grid-cols-2 gap-4 p-4 border rounded">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Category {category.toUpperCase()} Min
                        </label>
                        <input
                          type="string"
                          value={recencyRange[category].min}
                          disabled 
                          className="w-full p-2 border rounded bg-gray-100"
                          />
                      </div>
                      {category !== 'e' && ( 
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Category {category.toUpperCase()} Max
                          </label>
                          <input
                            type="number"
                            value={recencyRange[category].max}
                            onChange={(e) => handleRecencyChange(category, 'max', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                            />
                        </div>
                      )}
                    </div>
                    
                  ))}
                  {/* <div className="p-4 border rounded">
                    <label className="block text-sm font-medium mb-2">
                      Enter Value to Score
                    </label>
                    <input
                      type="number"
                      value={userValue}
                      onChange={(e) => setUserValue(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                      placeholder="Enter value to calculate score"
                      />
                  </div> */}
                </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Score Ranges:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Score</th>
                        <th className="border p-2">Range</th>
                      </tr>
                    </thead>

                    {/* <tbody>
                          {recencyScore && recencyScore.length > 0 ? (
                              recencyScore.map((item, index) => (
                                  <tr key={item._id || index}>
                                      <td className="border p-2">{item.Category}</td>
                                      <td className="border p-2">{item.Score}</td>
                                      <td className="border p-2">{item.Range}</td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                  <td colSpan="3" className="border p-2 text-center">
                                      No data available
                                  </td>
                              </tr>
                          )}
                      </tbody> */}

                    <tbody>
                      {Object.entries(recencyRange).map(([category, recencyValue], index) => (
                        <tr key={category}>
                          <td className="border p-2">{category.toUpperCase()}</td>
                          <td className="border p-2">{5 - index}</td>
                          <td className="border p-2">
                            {category === 'e' 
                              ? `${recencyValue.min} and above`
                              : `${recencyValue.min} - ${recencyValue.max}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                  Submit Score
                </button>
              </form>
              {/* {resultRecency && (
                <div className="mt-6 p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold">Results:</h3>
                  <p>Category: {resultRecency.category}</p>
                  <p>Score: {resultRecency.score}</p>
                </div>
              )} */}
          </div>
          {/* {Recency} */}
{/* ==================================================================================================================== */}
          {/* {Frequency} */}
            <div className='max-w-2xl mx-auto  p-6 bg-white rounded-lg shadow-lg xs:mt-4 sm:mt-4 md:mt-4 lg:mt-0'>
              <h2 className="text-2xl font-bold mb-4">Frequency Score Range </h2>
              <form onSubmit={handleFrequencySubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  
                  {Object.keys(range).map((category, index) => (
                    <div key={category} className="grid grid-cols-2 gap-4 p-4 border rounded">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Category {category.toUpperCase()} Min
                        </label>
                        <input
                          type="number"
                          value={ranges[category].min}
                          disabled 
                          className="w-full p-2 border rounded bg-gray-100"
                          />
                      </div>
                      {category !== 'e' && ( 
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Category {category.toUpperCase()} Max
                          </label>
                          <input
                            type="number"
                            value={ranges[category].max}
                            onChange={(e) => handleRangeChange(category, 'max', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                            />
                        </div>
                      )}
                    </div>
                  ))}
                  {/* <div className="p-4 border rounded">
                    <label className="block text-sm font-medium mb-2">
                      Enter Value to Score
                    </label>
                    <input
                    type="number"
                    value={userValue}
                    onChange={(e) => setUserValue(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                    placeholder="Enter value to calculate score"
                    />
                  </div> */}
                </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Score Ranges:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Score</th>
                        <th className="border p-2">Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(ranges).map(([category, range], index) => (
                        <tr key={category}>
                          <td className="border p-2">{category.toUpperCase()}</td>
                          <td className="border p-2">{index + 1} </td>
                          <td className="border p-2">
                            {category === 'e' 
                              ? `${range.min} and above`
                              : `${range.min} - ${range.max}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                  Store Score
                  </button>
              </form>
              {result && (
                <div className="mt-6 p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold">Results:</h3>
                  <p>Category: {result.category}</p>
                  <p>Score: {result.score}</p>
                </div>
              )}
            </div>
            {/* {Frequency} */}
{/* ==================================================================================================================== */}
            {/* {Monetary} */}
            <div className='max-w-2xl mx-auto  p-6 bg-white rounded-lg shadow-lg xs:mt-4 sm:mt-4 md:mt-4 lg:mt-0'>
            <h2 className="text-2xl font-bold mb-4">Monetary Score Range </h2>
            <form onSubmit={handleMonetarySubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                
                {Object.keys(monetaryValue).map((category, index) => (
                  <div key={category} className="grid grid-cols-2 gap-4 p-4 border rounded">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Category {category.toUpperCase()} Min
                      </label>
                      <input
                        type="number"
                        value={monetaryRange[category].min}
                        disabled 
                        className="w-full p-2 border rounded bg-gray-100"
                        />
                    </div>
                    {category !== 'e' && ( 
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Category {category.toUpperCase()} Max
                        </label>
                        <input
                          type="number"
                          value={monetaryRange[category].max}
                          onChange={(e) => handleMonetaryChange(category, 'max', e.target.value)}
                          className="w-full p-2 border rounded"
                          required
                          />
                      </div>
                    )}
                  </div>
                ))}
                {/* <div className="p-4 border rounded">
                  <label className="block text-sm font-medium mb-2">
                    Enter Value to Score
                  </label>
                  <input
                  type="number"
                  value={userValue}
                  onChange={(e) => setUserValue(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Enter value to calculate score"
                  />
                  </div> */}
              </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Score Ranges:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Category</th>
                      <th className="border p-2">Score</th>
                      <th className="border p-2">Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(monetaryRange).map(([category, monetaryValue], index) => (
                      <tr key={category}>
                        <td className="border p-2">{category.toUpperCase()}</td>
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">
                          {category === 'e' 
                            ? `${monetaryValue.min} and above`
                            : `${monetaryValue.min} - ${monetaryValue.max}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                Store Score
                </button>
            </form>
            {resultMonetary && (
              <div className="mt-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold">Results:</h3>
                <p>Category: {resultMonetary.category}</p>
                <p>Score: {resultMonetary.score}</p>
              </div>
            )}
            </div>
            {/* {Monetary} */}
          </div>
          <div className='w- h-'>
            <PowerBIEmbed
              embedConfig = {{
                type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
                id: 'd58f9459-bd3f-40d0-a6a5-2a64393f6f3e',
                embedUrl: "https://app.powerbi.com/reportEmbed?reportId=d58f9459-bd3f-40d0-a6a5-2a64393f6f3e&groupId=8562e231-d603-4e16-bc6f-4369ac2b4e7b&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUlORElBLUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19",
                accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Inp4ZWcyV09OcFRrd041R21lWWN1VGR0QzZKMCIsImtpZCI6Inp4ZWcyV09OcFRrd041R21lWWN1VGR0QzZKMCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYmY4ZmQwYTMtZWFiYi00YzJiLThkMGQtYWM2ZjcxMWI1OGQ0LyIsImlhdCI6MTczNDMyNzI3NiwibmJmIjoxNzM0MzI3Mjc2LCJleHAiOjE3MzQzMzE5MzEsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84WUFBQUFiZSs3NTVmSjFGK2VwQytGckYzbmdTVW45b212R2R6TklwYUVIOUFLMHRXdDRFeWlvdkRpdVZXSC9ic3RaUWdFIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6Ijg3MWMwMTBmLTVlNjEtNGZiMS04M2FjLTk4NjEwYTdlOTExMCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoic2F3YW50IiwiZ2l2ZW5fbmFtZSI6ImRldmFuZyIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjExMC4yMjYuMTc2LjYiLCJuYW1lIjoiZGV2YW5nICBzYXdhbnQiLCJvaWQiOiJhNTExN2RjMC0xYWM0LTQxZGUtOGY2OS01OTNkMjZlZTRkZTAiLCJwdWlkIjoiMTAwMzIwMDQxQkM1MTI3RiIsInJoIjoiMS5BY1lBbzlDUHY3dnFLMHlORGF4dmNSdFkxQWtBQUFBQUFBQUF3QUFBQUFBQUFBREdBTHZHQUEuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoicmxPRnRoREZsZmQtVlZuS3JidFN4UVUyNXdjWXNyWk9Ub2xXNFhHbDA2YyIsInRpZCI6ImJmOGZkMGEzLWVhYmItNGMyYi04ZDBkLWFjNmY3MTFiNThkNCIsInVuaXF1ZV9uYW1lIjoiZGV2YW5nc2F3YW50QG93bmVyNDQxLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6ImRldmFuZ3Nhd2FudEBvd25lcjQ0MS5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJ4ejRGRVd0LU8wMjFxOXBNSURfVEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2lkcmVsIjoiMSAyOCIsInhtc19wbCI6ImVuIn0.n50_i4RttbFIcBXnAqIFEDbuXWfsxVeOOxOypNIYeS1JZMe3nkEDcSF6Ib0iqmKdw1Qm_jaQNwSiJPn_8dS_wzti1ffyoAexszx6yx78CzAs08mNDZqplm66g0KoCHLa2YfYKXGQp5ACjsqsdqHI9at-QWnOzoo9SPRySdx_Z1jCBQ946YYsuW_7y_oFdwq6cDuWd0vX5yh2O9FX9GRJIIJBedeRJOgFWQDiGG2YRLdLnb_XjM7CXtvYDPp-E3pJe971uHvHTocbOsCoQ-cA_aj_u8JWVKWrILENtCjcT4ktZZI70uyJCQgiZpNWZ51PpTQ47ktfVy8EXNpp6_5bAA',
                tokenType: models.TokenType.Aad, // Use models.TokenType.Aad for SaaS embed
                settings: {
                  panes: {
                    filters: {
                      expanded: false,
                      visible: false
                    }
                  },
                  background: models.BackgroundType.Transparent,
                }
              }}
              
              eventHandlers = {
                new Map([
                  ['loaded', function () {console.log('Report loaded');}],
                  ['rendered', function () {console.log('Report rendered');}],
                  ['error', function (event) {console.log(event.detail);}],
                  ['visualClicked', () => console.log('visual clicked')],
                  ['pageChanged', (event) => console.log(event)],
                ])
              }

              cssClassName = { " flex justify-center mt-4 h-screen w-screen" }

              getEmbeddedComponent = { (embeddedReport) => {
                window.report = embeddedReport;
              }}
            />
            </div>
        </div>
    {/* </div> */}
    </>
      );
    };
  

export default Recency
