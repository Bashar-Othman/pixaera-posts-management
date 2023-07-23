import { HttpStatus } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { createMocks } from "node-mocks-http";
import { EntityNotFoundError } from "typeorm";

import { PostM } from "../entities/post.entity";
import { PostFilter } from "./post.filter";

describe("PostMFilter", () => {
  it("should be defined", () => {
    expect(new PostFilter()).toBeDefined();
  });

  it("should catch EntityNotFoundError", () => {
    const { req, res } = createMocks({
      method: "GET",
      url: "/post/0",
      params: { id: 0 },
    });
    const host = new ExecutionContextHost([req, res]);
    const exception = new EntityNotFoundError(PostM, {
      where: { id: 0 },
    });
    const filter = new PostFilter();

    filter.catch(exception, host);

    expect(res._getStatusCode()).toBe(HttpStatus.NOT_FOUND);
    expect(res._getJSONData()).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: `Not found any POST  with id: ${req.params.id}`,
      error: "POST Not Found",
    });
  });
});
