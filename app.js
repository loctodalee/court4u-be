'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const client_1 = require('@prisma/client');
const express_1 = __importDefault(require('express'));
const express_session_1 = __importDefault(require('express-session'));
const init_googleOAuth_1 = __importDefault(require('./lib/init.googleOAuth'));
const init_facebookOAuth_1 = __importDefault(
  require('./lib/init.facebookOAuth')
);
const compression_1 = __importDefault(require('compression'));
const init_redis_1 = require('./lib/init.redis');
const { ErrorResponse } = require('./handleResponse/error.response');
const morgan = require('morgan');
const app = (0, express_1.default)();
//init redis
(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield (0, init_redis_1.initRedis)();
    const cors = require('cors');
    app.use(express_1.default.json());
    app.use(
      express_1.default.urlencoded({
        extended: true,
      })
    );
    // Add headers before the routes are defined
    // Configure CORS
    const corsOptions = {
      origin: 'http://localhost:3000', // Allow this origin
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
      credentials: true, // Allow credentials
    };
    app.use(cors(corsOptions));
    app.use((0, compression_1.default)());
    const prisma = new client_1.PrismaClient();
    //init middleware
    app.use(morgan('dev'));
    app.use(
      (0, express_session_1.default)({
        secret: process.env.SESSION_SECRET || 'default_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
      })
    );
    //login with google
    app.use(init_googleOAuth_1.default.initialize());
    app.use(init_googleOAuth_1.default.session());
    //login with facebook
    app.use(init_facebookOAuth_1.default.initialize());
    app.use(init_facebookOAuth_1.default.session());
    // init route
    app.use('/', require('./route'));
    //handler Error
    app.use((req, res, next) => {
      const error = new ErrorResponse('Not found', 404);
      next(error);
    });
    app.use((error, req, res, next) => {
      const statusCode = error.status || 500;
      return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error',
      });
    });
  }))();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

module.exports = app;
