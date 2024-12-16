
import express from 'express';

import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from "dotenv";
import powerbiRoutes from './routes/powerbiRoutes.js';


import RecencyModel from './models/recencyModel.js';

dotenv.config()
const app = express();
app.use(cors());

app.use(express.json());
app.use(morgan('dev'));
app.use('/', powerbiRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// const powerbiConfig = {
//   workspaceID: "8562e231-d603-4e16-bc6f-4369ac2b4e7b",
//   datasetID: "e233492e-7921-4a5e-96fb-7ff5796ea7d7",
//   accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Inp4ZWcyV09OcFRrd041R21lWWN1VGR0QzZKMCIsImtpZCI6Inp4ZWcyV09OcFRrd041R21lWWN1VGR0QzZKMCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYmY4ZmQwYTMtZWFiYi00YzJiLThkMGQtYWM2ZjcxMWI1OGQ0LyIsImlhdCI6MTczNDA5MjIwMSwibmJmIjoxNzM0MDkyMjAxLCJleHAiOjE3MzQwOTY2ODcsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84WUFBQUFaRzh6bzE5Zk94OE81ejN3b05UME5yS2txQnBMMlZWNWRCRk5kSklSRlpNNTdjdFJHbi80VTZnY1VFNDBhd3I1IiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6Ijg3MWMwMTBmLTVlNjEtNGZiMS04M2FjLTk4NjEwYTdlOTExMCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoic2F3YW50IiwiZ2l2ZW5fbmFtZSI6ImRldmFuZyIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjExMC4yMjYuMTc2LjYiLCJuYW1lIjoiZGV2YW5nICBzYXdhbnQiLCJvaWQiOiJhNTExN2RjMC0xYWM0LTQxZGUtOGY2OS01OTNkMjZlZTRkZTAiLCJwdWlkIjoiMTAwMzIwMDQxQkM1MTI3RiIsInJoIjoiMS5BY1lBbzlDUHY3dnFLMHlORGF4dmNSdFkxQWtBQUFBQUFBQUF3QUFBQUFBQUFBREdBTHZHQUEuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoicmxPRnRoREZsZmQtVlZuS3JidFN4UVUyNXdjWXNyWk9Ub2xXNFhHbDA2YyIsInRpZCI6ImJmOGZkMGEzLWVhYmItNGMyYi04ZDBkLWFjNmY3MTFiNThkNCIsInVuaXF1ZV9uYW1lIjoiZGV2YW5nc2F3YW50QG93bmVyNDQxLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6ImRldmFuZ3Nhd2FudEBvd25lcjQ0MS5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJlMnpfNUNSRzlrQ2g1cmt4SnRVNEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2lkcmVsIjoiMSA4IiwieG1zX3BsIjoiZW4ifQ.lgcaQuzczyhJT4OltsDru-dVAIzGLV5k-KGntYkGhZqCRKIxad7wbtGXkYdYOeriWTUCAZhBi70wzyPMGlPvWHc1h2U0osORT1zhtmhfg_IkHuhkd_pfuFO2Hj1_svrLJfvPPh2eHTptcfat_lupM6RnP535wczwUT_I5iq9iiRiIgC3E5P4IGeqEMiSYEW5ksD9_xBbNwmS79jtyiFcnChJxW9XLDA4tc1vcXlXHER2vPDtBntA1jhpEVRfPmm0YPwCDQEl6EBgYwfSquys4gAbAOJnyH5WEhP2KZcAH2Xa4HoYyQqblhjFgB9Pc1vxfxjz1vPp-XwP_Aa9OH1viQ",
// }
// app.post('/refresh-dataset', async (req, res) => {
//   try {
    
//     const { workspaceId, datasetId, accessToken } = powerbiConfig;

//     if (!workspaceId || !datasetId || !accessToken) {
//       return res.status(500).json({ 
//         error: 'PowerBI configuration missing' 
//       });
//     }

//     const refreshUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/refreshes`;
    
//     const response = await fetch(refreshUrl, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`PowerBI API responded with status: ${response.status}`);
//     }

//     const result = await response.json();
//     res.json({ 
//       success: true, 
//       message: 'Dataset refresh triggered successfully',
//       data: result 
//     });

//   } catch (error) {
//     console.error('Error in PowerBI refresh:', error);
//     res.status(500).json({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// });



// app.get("/tablescore", (req, res)=>{
//   TableScore.find()
//   .then(score => res.json(score))
//   .catch(err => res.json(err))
// })

// app.post("/Recency", (req, res) => {
//   RecencyModel.create(req.body)
//     .then(recency => res.json(recency))
//     .catch(err => res.json(err));
// });

// app.post("/Recency", (req, res) => {
//   const { Category, Score, Range } = req.body;
//   RecencyModel.create({ Category, Score, Range   })
//     .then(recency => res.json(recency))
//     .catch(err => res.json(err));
// });

// app.get("/Recency", (req, res)=>{
//   RecencyModel.find(req.body)
//   .then(recency => res.json(recency))
//   .catch(err => res.json(err))
// })


// app.put('/tablescore/:id', async (req, res) => {
//   try {
//     const updatedScore = await TableScore.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true }
//     );
//     if (!updatedScore) {
//       return res.status(404).json({ message: 'Score not found' });
//     }
//     res.json(updatedScore);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });




// {recency}

app.get('/Recency', async (req, res) => {
  try {
      // Fetch from your database
      const recencyData = await RecencyModel.find();
      res.json(recencyData);
  } catch (error) {
      res.status(500).json({ 
          message: 'Error fetching recency data',
          error: error.message 
      });
  }
});

// app.put('/Recency', async (req, res) => {
//   try {
//       // Update your database
//       const updatedData = await RecencyModel.create(req.body);
//       res.json(updatedData);
//   } catch (error) {
//       res.status(500).json({
//           message: 'Error updating recency data',
//           error: error.message
//       });
//   }
// })

app.put('/Recency', async (req, res) => {
  try {
    const updates = req.body;
    // Remove all existing documents
    await RecencyModel.deleteMany({});
    // Insert new documents
    await RecencyModel.insertMany(updates);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// {recency}


// {Frequency}
import FrequencyModel from './models/frequencyModel.js';
app.get('/Frequency', async (req, res) => {
  try {
      // Fetch from your database
      const frequencyData = await FrequencyModel.find();
      
      res.json(frequencyData);
  } catch (error) {
      res.status(500).json({ 
          message: 'Error fetching recency data',
          error: error.message 
      });
  }
});

app.put('/Frequency', async (req, res) => {
  try {
    const updates = req.body;
    // Remove all existing documents
    await FrequencyModel.deleteMany({});
    // Insert new documents
    await FrequencyModel.insertMany(updates);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})


// {Frequency}


// {monetary}

import MonetaryModel from './models/monetaryModel.js';
app.get('/Monetary', async (req, res) => {
  try {
      // Fetch from your database
      const monetaryData = await MonetaryModel.find();
      res.json(monetaryData);
  } catch (error) {
      res.status(500).json({ 
          message: 'Error fetching recency data',
          error: error.message 
      });
  }
});

app.put('/Monetary', async (req, res) => {
  try {
    const updates = req.body;
    // Remove all existing documents
    await MonetaryModel.deleteMany({});
    // Insert new documents
    await MonetaryModel.insertMany(updates);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

// {monetary}


