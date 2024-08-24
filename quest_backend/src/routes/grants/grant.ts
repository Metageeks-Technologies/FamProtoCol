import { Router } from 'express';
import { getGrants, addGrant, updateGrantById, deleteGrantById } from '../../controllers/grants/grant'; 

const grantRouter = Router();

// Route to get all grants
grantRouter.get('/', getGrants);

// Route to add a new grant
grantRouter.post('/', addGrant);

// Route to update a grant by ID
grantRouter.put('/:id', updateGrantById);

// Route to delete a grant by ID
grantRouter.delete('/:id', deleteGrantById);

export default grantRouter;
