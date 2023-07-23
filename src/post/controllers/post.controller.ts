import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { JWTAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { SessionAuthGuard } from "../../auth/guards/session-auth.guard";
import { AuthUser } from "../../user/user.decorator";
import { User } from "../../user/user.entity";
import { PaginationQuery } from "../dtos/pagination-query.dto";
import { PostCreate } from "../dtos/post-create.dto";
import { PostUpdate } from "../dtos/post-update.dto";
import { PostM } from "../entities/post.entity";
import { PostFilter } from "../filters/post.filter";
import { IsOwnerInterceptor } from "../interceptors/is-owner.interceptor";
import { PaginationInterceptor } from "../interceptors/pagination.interceptor";
import { ParsePostPipe } from "../pipes/parse-post.pipe";
import { PostService } from "../services/post.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("post")
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@UseFilters(PostFilter)
@UseInterceptors(ClassSerializerInterceptor, IsOwnerInterceptor)
export class PostController {
  constructor(private readonly service: PostService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  createPost(
    @Body() newPost: PostCreate,
    @AuthUser() user: User
  ): Promise<PostM> {
    newPost.owner = user;

    return this.service.createPost(newPost);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(PaginationInterceptor)
  listPost(
    @Query() pagination: PaginationQuery,
    @AuthUser() user: User
  ): Promise<[PostM[], number]> {
    return this.service.listPost(pagination, user);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  getPost(@Param("id", ParseIntPipe) id: number): Promise<PostM> {
    return this.service.getPost(id);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"))
  updatePost(
    @Param("id", ParseIntPipe) id: number,
    @Body() updates: PostUpdate
  ): Promise<PostM> {
    return this.service.updatePost(id, updates);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.NO_CONTENT)
  removePost(
    @Param("id", ParseIntPipe, ParsePostPipe) PostM: PostM
  ): Promise<PostM> {
    return this.service.removePost(PostM);
  }
}
