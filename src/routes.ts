import { Router } from 'express'

import ClassesController from './controllers/ClassesController';

const classesController = new ClassesController();

const routes = Router();

routes.post('/users', classesController.store);

export default routes;