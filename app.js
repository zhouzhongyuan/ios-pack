import express from 'express';
import Poll from './bin/poll';
const app = express();
const poll = new Poll();
poll.start();
export default app;
