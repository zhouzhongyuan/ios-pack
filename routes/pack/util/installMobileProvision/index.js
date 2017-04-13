import mp from 'mobileprovision';
import download from '../download';
async function installMobileProvision(mpUrl) {
    await download(mpUrl, 'temp.mobileprovision');
    const value = await mp('temp.mobileprovision');
    console.log(value);
    return value;
}

export default installMobileProvision;
