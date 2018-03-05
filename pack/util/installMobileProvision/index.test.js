import imp from './index';
const url = 'https://dev.bokesoft.com/yigomobile2/download?id=59a4c099f094c527bc0fe9a2'; // thgn
test('get right arguments from mobileprovision file', async () => {
    expect.assertions(1);
    const d = await imp(url);
    expect(d.data.Name).toBe('com.trinasolar.mobile');
});
