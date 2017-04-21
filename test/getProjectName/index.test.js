import { expect } from 'chai';
import getProjectName from '../../pack/util/ios/getProjectName/index';
describe('Get the right ios project name', () => {
    it('ios project 应该得到项目名称 "yesapp"', () => {
        getProjectName('test/getProjectName/project')
            .then((data) => {
                expect(data).to.be.equal('yesapp');
            });
    });
    it('非ios project文件夹应当catch "No this file."', () => {
        getProjectName('notProject')
            .catch((data) => {
                expect(data).to.be.equal('No this file.');
            });
    });
});
