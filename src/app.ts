import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import router from './routes';
import errorMiddleware from './middlewares/error.middleware';
import authMiddleware from './middlewares/auth.middleware';

class App {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    // this.app.use('/images', express.static(`${__dirname}/images`));
    this.app.use(authMiddleware);
    this.app.use(router);
    this.app.use(errorMiddleware);
  }

  public app: express.Express;

  public start(PORT: number): void {
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
