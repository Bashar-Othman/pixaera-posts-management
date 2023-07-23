import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PostController } from "./controllers/post.controller";
import { PostM } from "./entities/post.entity";
import { PostService } from "./services/post.service";

@Module({
  imports: [TypeOrmModule.forFeature([PostM])],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
