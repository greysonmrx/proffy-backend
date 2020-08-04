import { Request, Response } from 'express';

import db from '../database/connection';

class ConnectionsController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.body;

    await db('connections').insert({
      user_id
    });

    return response.status(201).json();
  }
}

export default ConnectionsController;