import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import logger from 'koa-logger';
import { Server } from 'http';
import healthCheckRoutes from './controller/HealthCheckController';
import calendarRoutes from './controller/CalendarController';
import { getConfig } from './Configs';
import BlockPrinter from './util/BlockPrinter';
import { Environment } from './Constants';

const mongoose = require('mongoose');

export default class KoaApp {
  serviceName: string;

  versionCode: string;

  versionNumber: number;

  port: number;

  app: Koa;

  dbConnect : string = '';

  private server? : Server;

  constructor() {
    this.app = new Koa();
    this.serviceName = getConfig().serviceName;
    this.versionCode = getConfig().versionCode;
    this.versionNumber = getConfig().versionNumber;
    if (getConfig().env === Environment.UNIT_TEST_DOCKER) {
      this.dbConnect = 'mongodb://test:test@mongodb-test:27017';
    } else if (getConfig().env === Environment.UNIT_TEST) {
      this.dbConnect = 'mongodb://test:test@localhost:27018';
    } else {
      this.dbConnect = process.env.DB_CONNECTION as string;
    }
    this.port = getConfig().port;
    try {
      mongoose.connect(this.dbConnect,
        { useNewUrlParser: true, useUnifiedTopology: true }, () => { });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('e:\n', e);
    }
    this.app.use(bodyParser());
    this.app.use(cors({ origin: '*' }));
    this.app.use(logger());

    this.app.use(healthCheckRoutes.routes());
    this.app.use(calendarRoutes.routes());
  }

  start() {
    const blockPrinter = new BlockPrinter('Aplt Service');
    blockPrinter.push(`service name:      ${this.serviceName}`);
    blockPrinter.push(`version number:    ${this.versionNumber}`);
    blockPrinter.push(`version code:      ${this.versionCode}`);
    blockPrinter.push(`url:               http://localhost:${this.port}`);
    blockPrinter.push(`env:               ${getConfig().env}`);
    blockPrinter.push(`port:              ${this.port}`);
    blockPrinter.push(`db:                ${this.dbConnect}`);
    this.server = this.app.listen(this.port, async () => {
      blockPrinter.push('status:  running');
      blockPrinter.print();
    })
      .on('error', (err) => {
        blockPrinter.push('status: error');
        blockPrinter.print();
        // eslint-disable-next-line no-console
        console.error(err);
      });
    return this.server;
  }

  stop = () => {
    mongoose.connection.close().then();
    this.server?.close();
  };
}
