import BaseService from '../../../src/service/BaseService';
import BaseRequest from '../../../src/request/BaseRequest';

const service = new BaseService();

describe('[Method] ----> generateResponse', () => {
  it('Given: status, massage and data. Then: generate response.', () => {
    // arrange
    const ctxReq = {};
    const status = 200;
    const message = 'OK';
    const data = null;

    // act
    const response = service.generateResponse(
      ctxReq,
      status,
      message,
      data,
    );

    // assert
    expect(response.status).toEqual(status);
    expect((<any>(response.body)).message).toEqual(message);
  });
});

describe('[Method] ----> generate200Ok', () => {
  it('Given: data. Then: generate response.', () => {
    // act
    const ctx = service.generate200Ok({});

    // assert
    expect(ctx.status).toEqual(200);
    expect((<any>(ctx.body)).message).toEqual('OK');
  });
});

describe('[Method] ----> generate201Ok', () => {
  it('Given: data. Then: generate response.', () => {
    // arrange
    const message = 'Create Successfully';
    // act
    const ctx = service.generate201Ok({}, message);

    // assert
    expect(ctx.status).toEqual(201);
    expect((<any>(ctx.body)).message).toEqual(message);
  });
});

describe('[Method] ----> generate400RequestInvalid', () => {
  it('Given: errors. Then: generate response.', () => {
    // arrange
    const errors = [
      {
        target: {
          email: 'leo.cai@aplt.com',
          username: 'LeoCai',
          password: '12',
        },
        value: '12',
        property: 'password',
        children: [],
        constraints: {
          isLength: 'password must be longer than or equal to 6 characters',
        },
      },
    ];

    // act
    const ctx = service.generate400RequestInvalid({}, errors);

    // assert
    expect(ctx.status).toEqual(400);
    expect((<any>(ctx.body)).message).toEqual('Invalid Request');
    expect((<any>(ctx.body)).data).toMatchObject(errors);
  });
});

describe('[Method] ----> generate401Unauthorized', () => {
  it('Given: message. Then: generate response.', () => {
    // arrange
    const message = 'You do not have the permission to access this endpoint.';

    // act
    const ctx = service.generate401Unauthorized({}, message);

    // assert
    expect(ctx.status).toEqual(401);
    expect((<any>(ctx.body)).message).toEqual(message);
  });
});

describe('[Method] ----> generate403Forbidden', () => {
  it('Given: message. Then: generate response.', () => {
    // arrange
    const message = 'You are unauthorized';

    // act
    const ctx = service.generate403Forbidden({});

    // assert
    expect(ctx.status).toEqual(403);
    expect((<any>(ctx.body)).message).toEqual(message);
  });
});

describe('[Method] ----> generate500InternalError', () => {
  it('Given: error string, Then: generate response.', () => {
    // arrange
    const error = 'error message';

    // act
    const ctx = service.generate500InternalError({}, error);

    // assert
    expect(ctx.status).toEqual(500);
    expect((<any>(ctx.body)).message).toEqual(error);
  });
});
describe('[Method] ----> validateError', () => {
  it('Given: request with no error, Then: return undefined.', async () => {
    // arrange
    const ctx = {};
    const request = new BaseRequest();

    // act
    const response = await service.validateError(ctx, request);

    // assert
    expect(response).toEqual(null);
  });
  it('Given: request with 1 error, Then: return error response.', async () => {
    // arrange
    const request = new BaseRequest();
    request.testString = 'errorTestString';
    const error = [
      {
        target: { testString: 'errorTestString' },
        value: request.testString,
        property: 'testString',
        children: [],
        constraints: {
          isLength: 'testString must be shorter than or equal to 10 characters',
        },
      },
    ];

    // act
    const ctx = await service.validateError({}, request);

    // assert
    expect(ctx).toBeTruthy();
    expect(ctx?.status).toEqual(400);
    expect((<any>(ctx?.body)).message).toEqual('Invalid Request');
    expect((<any>(ctx?.body)).data).toMatchObject(error);
  });
});
