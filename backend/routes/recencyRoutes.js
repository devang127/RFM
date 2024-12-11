// import express from 'express';
// import RecencyModel from '../models/recencyModel.js';

// const router = express.Router();

// // GET endpoint for Recency
// router.get('/', async (req, res) => {
//   try {
//     const recencyData = await RecencyModel.find();
//     if (recencyData.length === 0) {
//       // Initialize with default data if none exists
//       const defaultData = [
//         { Category: 'A', Score: 5, Range: '0-30' },
//         { Category: 'B', Score: 4, Range: '31-60' },
//         { Category: 'C', Score: 3, Range: '61-90' },
//         { Category: 'D', Score: 2, Range: '91-120' },
//         { Category: 'E', Score: 1, Range: '121 and above' }
//       ];
//       await RecencyModel.insertMany(defaultData);
//       return res.json(defaultData);
//     }
//     res.json(recencyData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // PUT endpoint for Recency
// router.put('/', async (req, res) => {
//   try {
//     await RecencyModel.deleteMany({}); // Clear existing data
//     const updatedData = await RecencyModel.insertMany(req.body);
//     res.json(updatedData);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// export default router;