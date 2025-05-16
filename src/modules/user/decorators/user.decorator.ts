/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const getUser = createParamDecorator((data: unknown, context) => {
  const gqlCont: GqlExecutionContext = GqlExecutionContext.create(context);
  return gqlCont.getContext().req.user;
});
