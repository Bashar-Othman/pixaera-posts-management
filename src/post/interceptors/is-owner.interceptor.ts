import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

import { Pagination } from "../dtos/pagination.dto";
import { PostM } from "../entities/post.entity";

@Injectable()
export class IsOwnerInterceptor<T extends PostM | Pagination<PostM>>
  implements NestInterceptor<T, T>
{
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return next.handle().pipe(
      tap((PostM) => {
        if (!user || PostM instanceof Pagination) return;

        const userId =
          typeof PostM.owner === "object" ? PostM.owner.id : PostM.owner;
        const isOwner = userId === user.id;

        if (!isOwner) {
          throw new ForbiddenException(`PostM does not belong to you`);
        }
      })
    );
  }
}
