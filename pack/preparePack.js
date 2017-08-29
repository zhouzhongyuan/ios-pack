import fs from 'fs-extra-promise';
async function preparePack() {
    await fs.emptyDirAsync('log');
    await fs.emptyDirAsync('tmp');
}
export default preparePack;
