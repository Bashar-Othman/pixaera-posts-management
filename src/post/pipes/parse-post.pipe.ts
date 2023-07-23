import { Injectable, PipeTransform } from "@nestjs/common";

import { PostService } from "../services/post.service";

@Injectable()
export class ParsePostPipe implements PipeTransform {
  constructor(private readonly postService: PostService) {}

  transform(value: number) {
    return this.postService.getPost(value);
  }
}
