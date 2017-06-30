import * as Promise from 'bluebird';

export default Promise.promisifyAll(require('mysql'));