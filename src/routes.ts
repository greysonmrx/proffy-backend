import { Router } from 'express'

import ClassesController from './controllers/ClassesController';

const classesController = new ClassesController();

const routes = Router();

routes.get('/classes', classesController.index);
routes.post('/users', classesController.store);

export default routes;