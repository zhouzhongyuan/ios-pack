import { default as ic } from 'import-certificate';
import fs from 'fs-extra-promise';
import download from '../download/';
async function importCertificate(cerUrl, cerPassword) {
    const file = 'cer.p12';
    try {
        await download(cerUrl, file);
        const value = await ic(file, cerPassword);
        return value;
    } catch (e) {
        throw (e);
    } finally {
        await fs.remove(file);
    }
}
export default importCertificate;
