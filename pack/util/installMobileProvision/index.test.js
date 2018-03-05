import imp from './index';
// const url = 'http://1.1.8.34:3001/download?id=58ee3b9c18679c2c5dc0f9d6';
const url = 'https://dev.bokesoft.com/yigomobile2/download?id=59a4c099f094c527bc0fe9a2'; // thgn
test('get right arguments from mobileprovision file', async () => {
    expect.assertions(1);
    const d = await imp(url);
    console.log(d);
    expect(d).toBe('hi');
});
