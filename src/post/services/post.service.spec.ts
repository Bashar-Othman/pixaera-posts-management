import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from 'ts-auto-mock';
import { EntityNotFoundError, type Repository } from 'typeorm';

import type { User } from '../../user/user.entity';
import { PaginationQuery } from '../dtos/pagination-query.dto';
import type { PostCreate } from '../dtos/post-create.dto';
import type { PostUpdate } from '../dtos/post-update.dto';
import { PostM } from '../entities/post.entity';
import { PostService } from './post.service';

describe('PostMService', () => {
  let service: PostService;
  let mockedPostMRepository: jest.Mocked<Repository<PostM>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService],
    })
      .useMocker(token => {
        if (Object.is(token, getRepositoryToken(PostM))) {
          return createMock<Repository<PostM>>();
        }
      })
      .compile();

    service = module.get<PostService>(PostService);
    mockedPostMRepository = module.get(getRepositoryToken(PostM));
  });

  it('should be an instanceof PostMService', () => {
    expect(service).toBeInstanceOf(PostService);
  });

  it('should create a new PostM', async () => {
    const newPostM: PostCreate = {
      text: 'Make an appointment',
      owner: createMock<User>(),
    };

    mockedPostMRepository.save.mockResolvedValueOnce(
      createMock<PostM>({
        text: newPostM.text,
        is_active: false,
      }),
    );
    const PostM = await service.createPost(newPostM);

    expect(PostM).toBeDefined();
    expect(PostM).toHaveProperty('text', newPostM.text);
    expect(PostM).toHaveProperty('done', false);
  });

  it('should list all PostM', async () => {
    const owner = createMock<User>({ id: 1 });
    const [PostMs, count] = await service.listPost(new PaginationQuery(), owner);

    expect(Array.isArray(PostMs)).toBe(true);
    expect(count).toEqual(expect.any(Number));
  });

  it('should get one PostM', async () => {
    const id = 1;

    mockedPostMRepository.findOneOrFail.mockResolvedValueOnce(
      createMock<PostM>({ owner: 1 }),
    );
    const PostM = await service.getPost(id);

    expect(PostM).toBeDefined();
  });

  it('should throw on get one when the PostM not exist', async () => {
    const id = 0;

    mockedPostMRepository.findOneOrFail.mockRejectedValueOnce(
      new EntityNotFoundError(PostM, {
        where: { id },
        loadRelationIds: true,
      }),
    );

    await expect(service.getPost(id)).rejects.toThrow(EntityNotFoundError);
  });

  it('should update one PostM', async () => {
    const PostM = createMock<PostM>();
    const updates: PostUpdate = {
      is_active: true,
    };

    mockedPostMRepository.save.mockResolvedValueOnce(createMock<PostM>(updates));
    await expect(service.updatePost(PostM, updates)).resolves.toHaveProperty(
      'is_active',
      updates.is_active,
    );
  });

  it('should remove a post', async () => {
    const post = createMock<PostM>();

    await expect(service.removePost(post)).resolves.toBeDefined();
  });
});
