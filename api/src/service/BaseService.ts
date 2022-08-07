import { validate } from 'class-validator';
import { Context } from 'koa';
import BaseRequest from '../request/BaseRequest';

export default class BaseService {
  generate200Ok = (
    ctx: Context | any,
    data: object | null = null,
  ): Context => this.generateResponse(ctx, 200, 'OK', data);

  generate201Ok = (
    ctx: Context | any,
    message: string,
    data: object | null = null,
  ): Context => this.generateResponse(ctx, 201, message, data);

  generate400RequestInvalid = (
    ctx: Context | any,
    errors: object | string | null = null,
  ) : Context => {
    ctx.status = 400;
    ctx.body = { message: 'Invalid Request' };
    if (errors != null) (<any>(ctx.body)).data = errors;
    return ctx;
  };

  generate401Unauthorized = (ctx: Context | any, message: string): Context => {
    ctx.status = 401;
    ctx.body = { message };
    return ctx;
  };

  generate403Forbidden = (ctx: Context | any): Context => {
    ctx.status = 403;
    ctx.body = { message: 'You are unauthorized' };
    return ctx;
  };

  generate500InternalError = (ctx: Context | any, error: string = ''): Context => {
    ctx.status = 500;
    ctx.body = { message: `${error}` };
    return ctx;
  };

  generateResponse = (
    ctx: Context | any,
    status: number,
    message: string,
    data: object | null = null,
  ): Context => {
    ctx.status = status;
    ctx.body = { message };
    if (data) (<any>(ctx.body)).data = data;
    return ctx;
  };

  validateError = async (ctx: Context | any, request: BaseRequest):Promise<Context | null> => {
    const errors = await validate(request, {});
    if (errors.length > 0) {
      return this.generate400RequestInvalid(ctx, errors);
    }
    return null;
  };
}
