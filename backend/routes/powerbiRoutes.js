import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/refresh-dataset', async (req, res) => {
    try {
        // Get access token from environment variable
        const accessToken = process.env.accesstoken;
        const workspaceId = process.env.workspace_id;
        const datasetId = process.env.dataset_id;
        
        if (!accessToken) {
            return res.status(401).json({ error: 'PowerBI access token not configured' });
        }

        if (!workspaceId || !datasetId) {
            return res.status(400).json({ error: 'Workspace ID or Dataset ID not configured' });
        }

        const refreshUrl = `${api_url}/groups/${workspaceId}/datasets/${datasetId}/refreshes`;
        
        const response = await axios.post(refreshUrl, {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json({ 
            message: 'Dataset refresh triggered successfully',
            jobId: response.data.id 
        });
    } catch (error) {
        console.error('Error refreshing PowerBI dataset:', error);
        return res.status(500).json({ 
            error: 'Failed to trigger dataset refresh',
            details: error.message 
        });
    }
});

export default router;