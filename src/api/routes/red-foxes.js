import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';
import fs from 'fs';

import middlewares from '../middlewares';
import Logger from '../../loaders/logger';
import RedFoxService from '../../services/red-fox';

const route = Router();
const upload = multer({ dest: 'uploads/' });

export default (app) => {
  app.use('/red-foxes', route);

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
      Logger.debug('Calling GET red-foxes endpoint');
      try {
        const redFoxService = new RedFoxService();

        const {
          searchTerm,
          pageSize,
          pageIndex,
          sortBy,
          sortByDesc,
          status,
        } = req.query;

        const { data, totalCount } = await redFoxService.All({
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
      Logger.debug(`Calling POST red-foxes/import endpoint`);
      try {
        const redFoxService = new RedFoxService();
        const data = await redFoxService.Import({
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
      Logger.debug(`Calling POST red-foxes/export endpoint`);
      try {
        const redFoxService = new RedFoxService();
        const { file, filename } = await redFoxService.Export({
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
        `Calling GET red-foxes/pdf endpoint with ID: ${req.params.id}`,
      );
      try {
        const redFoxService = new RedFoxService();
        const { file, filename } = await redFoxService.GeneratePdf({
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
      Logger.debug(`Calling GET red-foxes endpoint with ID: ${req.params.id}`);
      try {
        const redFoxService = new RedFoxService();
        const data = await redFoxService.Single({
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
        name: Joi.string().required(),
        status: Joi.string().required(),
      }),
    }),
    async (req, res, next) => {
      Logger.debug('Calling POST red-foxes/create endpoint');
      try {
        const redFoxService = new RedFoxService();
        const data = await redFoxService.Create({
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
        name: Joi.string(),
        status: Joi.string(),
      }),
    }),
    async (req, res, next) => {
      Logger.debug(
        `Calling POST red-foxes/update endpoint with ID: ${req.params.id}`,
      );
      try {
        const redFoxService = new RedFoxService();
        const data = await redFoxService.Update({
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
    Logger.debug(`Calling DELETE red-foxes endpoint with ID: ${req.params.id}`);
    return res.status(404).json({ message: 'Use POST /red-foxes/delete/:id' });
  });

  route.post(
    '/delete/:id',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.rateLimiter,
    async (req, res, next) => {
      Logger.debug(
        `Calling POST red-foxes/delete endpoint with ID: ${req.params.id}`,
      );
      try {
        const redFoxService = new RedFoxService();
        const data = await redFoxService.Delete({
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
        name: Joi.string(),
        status: Joi.string(),
      }),
    }),
    async (req, res, next) => {
      Logger.debug(
        `Calling POST red-foxes/update endpoint with ID: ${req.params.id}`,
      );
      try {
        const redFoxService = new RedFoxService();
        const data = await redFoxService.Duplicate({
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
          `Calling POST red-foxes/create-fake endpoint with count: ${
            req.body.count || req.params.count
          }`,
        );
        try {
          const redFoxService = new RedFoxService();
          const data = await redFoxService.CreateFake({
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
