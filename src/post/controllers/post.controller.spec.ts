import { Test, type TestingModule } from '@nestjs/testing';
import { createMock } from 'ts-auto-mock';

import type { User } from '../../user/user.entity';
import { PaginationQuery } from '../dtos/pagination-query.dto';
import type { PostCreate } from '../dtos/post-create.dto';
import type { PostUpdate } from '../dtos/post-update.dto';
import type { PostM } from '../entities/post.entity';
import { PostService } from '../services/post.service';
import { PostController } from './post.controller';

describe('Post Controller', () => {
  let controller: PostController;
  let mockedPostService: jest.Mocked<PostService>;
  const user = createMock<User>({ id: 1 });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
    })
      .useMocker(token => {
        if (Object.is(token, PostService)) {
          return createMock<PostService>();
        }
      })
      .compile();

    controller = module.get<PostController>(PostController);
    mockedPostService = module.get(PostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new PostM', async () => {
    const newPost: PostCreate = {
      text: 'Make a sandwich',
      owner: user,
    };

    mockedPostService.createPost.mockResolvedValue(createMock<PostM>(newPost));

    await expect(controller.createPost(newPost, user)).resolves.toBeDefined();
  });

  it('should list all PostMs', async () => {
    const [PostMs, count] = await controller.listPost(
      new PaginationQuery(),
      user,
    );

    expect(Array.isArray(PostMs)).toBe(true);
    expect(count).toEqual(expect.any(Number));
  });

  it('should get one PostM', async () => {
    const id = 1;

    mockedPostService.getPost.mockResolvedValueOnce(createMock<PostM>({ id }));
    const PostM = await controller.getPost(id);

    expect(PostM).toHaveProperty('id', id);
  });

  it('should update one Post', async () => {
    const updates: PostUpdate = {
      is_active: true,
      text: 'This Tesrt POST :-).',
    };

    mockedPostService.updatePost.mockResolvedValueOnce(
      createMock<PostM>(updates),
    );
    const PostM = await controller.updatePost(
      createMock<PostM>({ id: 1 }),
      updates,
    );

    expect(PostM).toHaveProperty('is_active', updates.is_active);
    expect(PostM).toHaveProperty('text', updates.text);
  });

  it('should remove one PostM', async () => {
    const PostM = createMock<PostM>({ id: 1 });

    await expect(controller.removePost(PostM)).resolves.toBeDefined();
  });

  it('should mark PostM as done', async () => {
    mockedPostService.updatePost.mockResolvedValueOnce(
      createMock<PostM>({ is_active: true }),
    );
    const post = await controller.markPostAsDone(
      createMock<PostM>({ id: 1, is_active: false }),
    );

    expect(post).toHaveProperty('is_active', true);
  });

  it('should mark post as pending', async () => {
    mockedPostService.updatePost.mockResolvedValueOnce(
      createMock<PostM>({ is_active: false }),
    );
    const post = await controller.markPostAsPending(
      createMock<PostM>({ id: 1, is_active: true }),
    );

    expect(post).toHaveProperty('done', false);
  });
});
