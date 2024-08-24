import express from 'express';
import {   createKols, deleteKol, getAllKol, getKolById, updateKol } from '../../controllers/kols/kols';
import { isAuthenticated } from '../../middleware/user/authorize.user';

const kolsRouter = express.Router();

kolsRouter.get('/get', getAllKol);
kolsRouter.post('/create',createKols);
kolsRouter.get('/:id', getKolById);
kolsRouter.put('/:id', isAuthenticated,updateKol);
kolsRouter.delete('/:id',isAuthenticated,deleteKol);

export default kolsRouter;