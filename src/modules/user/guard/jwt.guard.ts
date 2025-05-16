/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext, GraphQLExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtSer: JwtService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCont: GraphQLExecutionContext =
      GqlExecutionContext.create(context);
    const req = gqlCont.getContext().req;

    const token: string = req.headers.authorization.split(' ')[1];
    if (!token) throw new NotFoundException('Token not found');
    const payload = this.jwtSer.verify(token);
    if (!payload)
      throw new UnauthorizedException('invalid token you are not authorized');
    req.user = { id: payload.sub };
    return Promise.resolve(true);
  }
}
