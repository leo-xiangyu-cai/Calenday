import { Server } from 'http';
import KoaApp from '../../../src/KoaApp';
import { getConfig } from '../../../src/Configs';
import { HealthEntity } from '../../../src/entity/Health';

const request = require('supertest');

const koaApp = new KoaApp();
const testServer: Server = koaApp.start();

beforeAll(() => {
});

afterEach(async () => {
});

afterAll(async () => {
  await HealthEntity.collection.drop();
  koaApp.stop();
});

describe('[GET] -------> /connection-check', () => {
  it('connection check should return OK', async () => {
    // act
    const response = await request(testServer).get('/connection-check');

    // assert
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.message).toEqual('OK');
    expect(response.body.data.environment).toEqual(getConfig().env);
    expect(response.body.data.dbStatus).toEqual('connected');
  });
});
