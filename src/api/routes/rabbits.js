import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';
import fs from 'fs';

import middlewares from '../middlewares';
import Logger from '../../loaders/logger';
import RabbitService from '../../services/rabbit';

const route = Router();
const upload = multer({ dest: 'uploads/' });

export default (app) => {
  app.use('/rabbits', route);

  route.get(
    '/',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.rateLimiter,
    celebrate({
      query: Joi.object({
        searchTerm: Joi.string().allow(''),
        pageSize: Joi.number(),
        pageIndex: Joi.number(),
        sortBy: Joi.string(),
        sortByDesc: Joi.bool(),
        status: Joi.string(),
      }),
    }),
    async (req, res, next) => {
      Logger.debug('Calling GET rabbits endpoint');
      try {
        const rabbitService = new RabbitService();

        const {
          searchTerm,
          pageSize,
          pageIndex,
          sortBy,
          sortByDesc,
          status,
        } = req.query;

        const { data, totalCount } = await rabbitService.All({
          searchTerm,
          pageSize,
          pageIndex,
          sortBy,
          sortByDesc,
          status,
          currentUser: req.currentUser,
        });

        return res
          .status(200)
          .json({ data, totalCount, searchTerm, pageSize, pageIndex });
      } catch (e) {
        Logger.error(e);
        return next(e);
      }
    },
  );

  route.post(
    '/import',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.rateLimiter,
    upload.single('file'),
    async (req, res, next) => {
      Logger.debug(`Calling POST rabbits/import endpoint`);
      try {
        const rabbitService = new RabbitService();
        const data = await rabbitService.Import({
          file: req.file,
          currentUser: req.currentUser,
        });
        // Delete file after import
        if (data) {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              Logger.error('🔥 error: %o', err);
            }
          });
        }
        return res.status(201).json(data);
      } catch (e) {
        Logger.error(e);
        return next(e);
      }
    },
  );

  route.get(
    '/export',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.rateLimiter,
    celebrate({
      query: Joi.object({
        status: Joi.string(),
      }),
    }),
    async (req, res, next) => {
      Logger.debug(`Calling POST rabbits/export endpoint`);
      try {
        const rabbitService = new RabbitService();
        const { file, filename } = await rabbitService.Export({
          status: req.query.status,
          currentUserId: req.currentUser._id,
        });

        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${filename}`,
        );
        res.set('Content-Type', 'text/csv');

        return res.status(200).send(file);
      } catch (e) {
        Logger.error(e);
        return next(e);
      }
    },
  );

  route.get(
    '/:id/pdf',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.rateLimiter,
    async (req, res, next) => {
      Logger.debug(
        `Calling GET rabbits/pdf endpoint with ID: ${req.params.id}`,
      );
      try {
        const rabbitService = new RabbitService();
        const { file, filename } = await rabbitService.GeneratePdf({
          id: req.params.id,
          currentUser: req.currentUser,
        });

        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${filename}`,
        );
        res.set('Content-Type', 'application/pdf');

        return res.status(200).send(file);
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.get(
    '/:id',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.rateLimiter,
    async (req, res, next) => {
      Logger.debug(`Calling GET rabbits endpoint with ID: ${req.params.id}`);
      try {
        const rabbitService = new RabbitService();
        const data = await rabbitService.Single({
          filter: { _id: req.params.id },
          currentUser: req.currentUser,
        });
        return res.status(200).json(data);
      } catch (e) {
        Logger.error(e);
        return next(e);
      }
    },
  );

  route.post(
    '/create',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.rateLimiter,
    celebrate({
      body: Joi.object({
        title: Joi.string().required(),
        status: Joi.string().required(),
        cost: Joi.number(),
        image: Joi.string(),
      }),
    }),
    async (req, res, next) => {
      Logger.debug('Calling POST rabbits/create endpoint');
      try {
        const rabbitService = new RabbitService();
        const data = await rabbitService.Create({
          currentUserId: req.currentUser._id,
          ...req.body,
        });
        return res.status(201).json(data);
      } catch (e) {
        Logger.error(e);
        return next(e);
      }
    },
  );

  route.post(
    '/update/:id',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.rateLimiter,
    celebrate({
      body: Joi.object({
        title: Joi.string(),
        status: Joi.string(),
        cost: Joi.number(),
        image: Joi.string(),
      }),
    }),
    async (req, res, next) => {
      Logger.debug(
        `Calling POST rabbits/update endpoint with ID: ${req.params.id}`,
      );
      try {
        const rabbitService = new RabbitService();
        const data = await rabbitService.Update({
          id: req.params.id,
          update: req.body,
        });
        return res.status(200).json(data);
      } catch (e) {
        Logger.error(e);
        return next(e);
      }
    },
  );

  route.delete('/:id', async (req, res) => {
    Logger.debug(`Calling DELETE rabbits endpoint with ID: ${req.params.id}`);
    return res.status(404).json({ message: 'Use POST /rabbits/delete/:id' });
  });

  route.post(
    '/delete/:id',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.rateLimiter,
    async (req, res, next) => {
      Logger.debug(
        `Calling POST rabbits/delete endpoint with ID: ${req.params.id}`,
      );
      try {
        const rabbitService = new RabbitService();
        const data = await rabbitService.Delete({
          id: req.params.id,
        });
        return res.status(200).json(data);
      } catch (e) {
        Logger.error(e);
        return next(e);
      }
    },
  );

  route.post(
    '/duplicate/:id',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.rateLimiter,
    celebrate({
      body: Joi.object({
        title: Joi.string(),
        status: Joi.string(),
      }),
    }),
    async (req, res, next) => {
      Logger.debug(
        `Calling POST rabbits/update endpoint with ID: ${req.params.id}`,
      );
      try {
        const rabbitService = new RabbitService();
        const data = await rabbitService.Duplicate({
          id: req.params.id,
          update: req.body,
          currentUserId: req.currentUser._id,
        });
        return res.status(200).json(data);
      } catch (e) {
        Logger.error(e);
        return next(e);
      }
    },
  );

  if (process.env.NODE_ENV === 'development') {
    route.post(
      '/create-fake/:count',
      middlewares.isAuth,
      middlewares.attachCurrentUser,
      celebrate({
        body: Joi.object({
          status: Joi.string(),
          ownerId: Joi.string(),
          count: Joi.number(),
        }),
      }),
      async (req, res, next) => {
        Logger.debug(
          `Calling POST rabbits/create-fake endpoint with count: ${
            req.body.count || req.params.count
          }`,
        );
        try {
          const rabbitService = new RabbitService();
          const data = await rabbitService.CreateFake({
            count: req.body.count || req.params.count,
            ...req.body,
          });
          return res.status(200).json(data);
        } catch (e) {
          Logger.error(e);
          return next(e);
        }
      },
    );
  }
};
