
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv  from "dotenv"

import RecencyModel from './models/recencyModel.js';
// import recencyRoutes from './routes/recencyRoutes.js';
dotenv.config()
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
// app.use('/Recency', recencyRoutes);
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
