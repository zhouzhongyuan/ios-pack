import mongoose from 'mongoose';
mongoose.Promise = Promise;
function connect(url, opt) {
    mongoose.connect(url, opt)
        .then(
            () => {
                console.log('Database connect success.');   // eslint-disable-line no-console
            },
            (err) => {
                console.error(`Mongoose connections error: ${err}`);   // eslint-disable-line no-console
                process.exit(1);
            }
        );
}
export default connect;
