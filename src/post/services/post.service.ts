import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../user/user.entity";
import { PaginationQuery } from "../dtos/pagination-query.dto";
import { PostCreate } from "../dtos/post-create.dto";
import { PostUpdate } from "../dtos/post-update.dto";
import { PostM } from "../entities/post.entity";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostM)
    private readonly repo: Repository<PostM>
  ) {}

  createPost(newPost: PostCreate): Promise<PostM> {
    const post = this.repo.create(newPost);

    return this.repo.save(post);
  }

  listPost(
    pagination: PaginationQuery,
    owner: User
  ): Promise<[PostM[], number]> {
    return this.repo.findAndCount({
      where: { owner: { id: owner.id } },
      order: { createdAt: "DESC" },
      skip: pagination.offset,
      take: pagination.limit,
      loadRelationIds: true,
    });
  }

  getPost(id: number): Promise<PostM> {
    return this.repo.findOneOrFail({
      where: { id },
      loadRelationIds: true,
    });
  }

  async updatePost(id: number, updates: PostUpdate): Promise<PostM> {
    const po: PostM = await this.getPost(id);
    this.repo.merge(po, updates);

    return this.repo.save(po);
  }

  removePost(post: PostM): Promise<PostM> {
    return this.repo.remove(post);
  }
}
