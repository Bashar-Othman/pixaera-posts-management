import { CallHandler, ForbiddenException } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { createMocks } from "node-mocks-http";
import { lastValueFrom, of } from "rxjs";
import { createMock } from "ts-auto-mock";

import { User } from "../../user/user.entity";
import { Pagination } from "../dtos/pagination.dto";
import { PostM } from "../entities/post.entity";
import { IsOwnerInterceptor } from "./is-owner.interceptor";

describe("IsOwnerInterceptor", () => {
  it("should be defined", () => {
    expect(new IsOwnerInterceptor()).toBeDefined();
  });

  it("should check that the authenticated user is the owner of the PostM", async () => {
    const { req, res } = createMocks({
      method: "GET",
      url: "/PostM/1",
      user: createMock<User>({ id: 1 }),
    });
    const context = new ExecutionContextHost([req, res]);
    const post = createMock<PostM>({ owner: 1 });

    const next = createMock<CallHandler<PostM>>({
      handle: () => of(post),
    });
    const interceptor = new IsOwnerInterceptor<PostM>();

    const result = await lastValueFrom(interceptor.intercept(context, next));

    expect(result).toEqual(post);
  });

  it("should check that the authenticated user is not the owner of the PostM", async () => {
    const { req, res } = createMocks({
      method: "GET",
      url: "/post/2",
      user: createMock<User>({ id: 1 }),
    });
    const context = new ExecutionContextHost([req, res]);
    const next = createMock<CallHandler<PostM>>({
      handle: () => of(createMock<PostM>({ owner: 2 })),
    });
    const interceptor = new IsOwnerInterceptor<PostM>();

    await expect(
      lastValueFrom(interceptor.intercept(context, next))
    ).rejects.toThrow(ForbiddenException);
  });

  it("should check that an array of POST pass", async () => {
    const { req, res } = createMocks({
      method: "GET",
      url: "/post",
      user: createMock<User>({ id: 1 }),
    });
    const context = new ExecutionContextHost([req, res]);
    const pagination = createMock<Pagination<PostM>>({ items: [] });
    const next = createMock<CallHandler<Pagination<PostM>>>({
      handle: () => of(pagination),
    });
    const interceptor = new IsOwnerInterceptor<Pagination<PostM>>();

    const result = await lastValueFrom(interceptor.intercept(context, next));

    expect(result).toEqual(pagination);
  });
});
