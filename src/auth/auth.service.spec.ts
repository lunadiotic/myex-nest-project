import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (name: string, email: string, password: string) => {
        return Promise.resolve({ id: 1, name, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const user = await service.register(
      'Jane Doe',
      'hv3RU@example.com',
      'password',
    );

    expect(user.name).toBe('Jane Doe');
    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should fail to create a user with an existing email', async () => {
    fakeUsersService.find = () => {
      return Promise.resolve([
        {
          id: 1,
          name: 'John Doe',
          email: 'hv3RU@example.com',
          password: 'password',
        } as User,
      ]);
    };
    await expect(
      service.register('John Doe', 'hv3RU@example.com', 'password'),
    ).rejects.toThrow('Email sudah terdaftar');
  });

  it('should fail if user login with invalid email', async () => {
    await expect(service.login('admin@mail.com', 'password')).rejects.toThrow(
      'Email tidak terdaftar',
    );
  });
});
