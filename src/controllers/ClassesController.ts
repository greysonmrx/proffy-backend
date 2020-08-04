import { Request, Response } from "express";

import db from '../database/connection';

import convertHoursToMinutes from '../utils/convertHoursToMinutes';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

interface IndexRequestQuery {
  subject: string;
  week_day: string;
  time: string;
  [key: string]: any;
}

class ClassesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { subject, week_day, time } = request.query as IndexRequestQuery;

    if (!subject || !week_day || !time) {
      return response.status(400).json({
        error: "Está faltando os filtros"
      });
    }

    const timeInMinutes = convertHoursToMinutes(time);

    const classes = await db('classes')
      .whereExists(function () {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
      })
      .where('classes.subject', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*']);

    return response.status(200).json(classes);
  }

  public async store(request: Request, response: Response): Promise<Response> {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = request.body;

    const insertedUsersIds = await db('users').insert({
      name,
      avatar,
      whatsapp,
      bio,
    });

    const user_id = insertedUsersIds[0];

    const insertedClassesIds = await db('classes').insert({
      subject,
      cost,
      user_id
    });

    const class_id = insertedClassesIds[0];

    const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
      return {
        class_id,
        week_day: scheduleItem.week_day,
        from: convertHoursToMinutes(scheduleItem.from),
        to: convertHoursToMinutes(scheduleItem.to)
      }
    });

    await db('class_schedule').insert(classSchedule);

    return response.status(201).json();
  }
}

export default ClassesController;