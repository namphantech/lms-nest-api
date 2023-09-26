import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Brackets, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { CachingService } from './../caching/caching.service';
@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly cachingService: CachingService,
  ) {
    super(userRepository);
  }

  async get(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations: ['role'] });
  }

  async getByUserEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async create(payload: Partial<User>): Promise<User> {
    const user = await this.getByUserEmail(payload.email);

    if (user) {
      throw new NotAcceptableException(
        'User with provided userid already created.',
      );
    }

    return await this.userRepository.save(payload);
  }

  async findRole(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    return role;
  }

  async updateUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  public async getMany(req: CrudRequest) {
    const { parsed, options } = req;
    const builder = await this.createBuilder(parsed, options);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const searchName = req?.query?.searchName;
    if (searchName) {
      builder.andWhere(
        new Brackets((query) => {
          // query.where('User.firstName ilike :search', {search: `%${search}%`})
          //   .orWhere('User.lastName ilike :search', {search: `%${search}%`})
          query.where("User.firstName || ' ' || User.lastName ilike :search", {
            search: `%${searchName}%`,
          });
        }),
      );
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let searchId = req?.query?.searchId;
    if (searchId) {
      searchId = parseInt(searchId, 10);
      if (Number.isInteger(searchId) === false) {
        searchId = 0;
      }
      builder.andWhere(
        new Brackets((query) => {
          query.where('User.id = :searchId', { searchId });
        }),
      );
    }
    return this.doGetMany(builder, parsed, options);
  }
}
