import { PrismaClient } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import { IErrorResponse } from './handleResponse/iError.response';
import session from 'express-session';
import googlePassport from './lib/init.googleOAuth';
import facebookPassport from './lib/init.facebookOAuth';
import compression from 'compression';
import { initRedis } from './lib/init.redis';
const { ErrorResponse } = require('./handleResponse/error.response');
const morgan = require('morgan');
const app = express();
//init redis
(async () => {
  await initRedis();
  const cors = require('cors');
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  // Add headers before the routes are defined
  // Configure CORS
  const corsOptions = {
    origin: '*', // Allow this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true, // Allow credentials
  };

  app.use(cors(corsOptions));

  app.use(compression());

  const prisma = new PrismaClient();
  //init middleware
  app.use(morgan('dev'));
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default_secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    })
  );

  //login with google
  app.use(googlePassport.initialize());
  app.use(googlePassport.session());

  //login with facebook
  app.use(facebookPassport.initialize());
  app.use(facebookPassport.session());
  // init route
  app.use('/', require('./route'));

  //handler Error
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new ErrorResponse('Not found', 404);
    next(error);
  });

  app.use(
    (
      error: IErrorResponse,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const statusCode = error.status || 500;
      return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error',
      });
    }
  );
})();
module.exports = app;
