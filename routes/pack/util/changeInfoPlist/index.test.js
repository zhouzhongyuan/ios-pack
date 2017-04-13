import changeInfoPlist from './index';
changeInfoPlist('routes/pack/util/changeInfoPlist/Info.plist', '2.0.1')
    .then((d) => {
        console.log(d);
    })
    .catch((d) => {
        console.log(d);
    });