import * as nock from 'nock';
import Fetch, { ApiError, NetworkError } from '../src';

test('should return false given external link', async () => {
  nock('http://mycoolurl.com')
    .get('/200')
    .reply(200, 'all good');

  const response = await new Fetch('http://mycoolurl.com/200').request();

  expect(response).toEqual('all good');
});
