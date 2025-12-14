import express from 'express';
import * as sweetsController from '../controllers/sweets.controller.js';
import { userAuth, adminAuth } from '../middleware/userAuth.middleware.js';

const sweetRouter=express.Router();

sweetRouter.get('/', sweetsController.getAllSweets);
sweetRouter.get('/search', userAuth, sweetsController.searchSweets);

sweetRouter.post('/:id/purchase', userAuth, sweetsController.purchaseSweet);

sweetRouter.post('/', userAuth, adminAuth, sweetsController.createSweet);
sweetRouter.put('/:id', userAuth, adminAuth, sweetsController.updateSweet);
sweetRouter.delete('/:id', userAuth, adminAuth, sweetsController.deleteSweet);
sweetRouter.post('/:id/restock', userAuth, adminAuth, sweetsController.restockSweet);


export default sweetRouter;