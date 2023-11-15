import express from 'express';
import 'express-async-errors';
import cors from 'cors';
// import router from './routes';
// import httpErrorMiddleware from './middlewares/httpError.middleware';

class App {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    // this.app.use('/images', express.static(`${__dirname}/images`));
    // this.app.use(router);
    // this.app.use(httpErrorMiddleware);
    // this.app.use(httpErrorMiddleware);
  }

  public app: express.Express;

  public start(PORT): void {
    this.app.listen(
      PORT,
      () =>
        // eslint-disable-next-line no-console
        console.log(`Server is running at http://localhost:${PORT}`),
      // eslint-disable-next-line function-paren-newline
    );
  }
}

export default App;
