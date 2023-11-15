import 'dotenv/config';
import App from './app';

const PORT = Number(process.env.SERVER_PORT) || 3071;

new App().start(PORT);
