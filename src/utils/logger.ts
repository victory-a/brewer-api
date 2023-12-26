import { type Express } from 'express';

import morgan from 'morgan';

function logger(app: Express) {
  morgan.token('req-headers', function (req, res) {
    return JSON.stringify(req.headers);
  });
  // process.env.NODE_ENV === 'development' && app.use(morgan(':method :url :status :req-headers'));
  process.env.NODE_ENV === 'development' && app.use(morgan(':method :url'));
}

export default logger;
