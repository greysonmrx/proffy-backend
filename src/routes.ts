import { Router } from 'express'

import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsCOntroller';

const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

const routes = Router();

routes.get('/classes', classesController.index);
routes.post('/users', classesController.store);

routes.post('/connections', connectionsController.store);

export default routes;