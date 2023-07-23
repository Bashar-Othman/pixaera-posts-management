import { Test } from "@nestjs/testing";
import { createMock } from "ts-auto-mock";

import { PostService } from "../services/post.service";
import { ParsePostPipe } from "./parse-post.pipe";

describe("ParsePostMPipe", () => {
  let pipe: ParsePostPipe;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: PostService,
          useValue: createMock<PostService>(),
        },
        ParsePostPipe,
      ],
    }).compile();

    pipe = module.get(ParsePostPipe);
  });

  it("should be defined", () => {
    expect(pipe).toBeDefined();
  });
});
