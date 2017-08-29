import moment from 'moment';
import readline from 'readline';
import pack from '../pack/pack.ios';
import { Task } from '../models/index';
function findTask() {
    return new Promise((resolve, reject) => {
        Task.findOne({ 'status.code': 'waiting' }, null, { sort: { dateOfCreate: 1 } }, (err, task) => {
            if (err) {
                reject(err);
            }
            if (!task) {
                reject('No waiting task.');
            }
            resolve(task);
        });
    });
}
function findProcessingTask() {
    console.log('Only exec findProcessingTask at start.'); // eslint-disable-line
    return new Promise((resolve, reject) => {
        Task.find({ 'status.code': 'processing' }, null, { sort: { dateOfCreate: 1 } }, (err, task) => {
            if (err) {
                reject(err);
            }
            if (!task) {
                resolve('No processing task.');
            }
            resolve(task);
        });
    });
}
function Poll() {
    this.interval = null;
    this.busy = false;
    this.firstMonitor = true;
}
Poll.prototype = {
    start() {
        this.interval = setInterval(() => {
            this.monitor();
        }, 5 * 1000);
    },
    stop() {
        clearInterval(this.interval);
    },
    async monitor() {
        if (this.busy) {
            return;
        }
        this.busy = true;
        if (this.firstMonitor) {
            // processing to waiting
            const processingTask = await findProcessingTask();
            for (let i = 0; i < processingTask.length; i++) {
                const task = processingTask[i];
                task.status.code = 'waiting';
                await task.save();
            }
            this.firstMonitor = false;
        }
        findTask()
            .then(task => pack(task))
            .then(() => {
                this.busy = false;
            })
            .catch((err) => {
                printProgress(err);
                this.busy = false;
            });
    },
};
function printProgress(err) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${moment().format('YYYY-MM-DD HH:mm:ss')}  ${err} \r`);   // eslint-disable-line no-console
}
Poll.prototype.constructor = Poll;
export default Poll;
