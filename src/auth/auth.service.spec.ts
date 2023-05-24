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

  it('should fail if user login with invalid password', async () => {
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
      service.login('hv3RU@example.com', 'password'),
    ).rejects.toThrow('Password salah');
  });

  it('should login existing user', async () => {
    fakeUsersService.find = () => {
      return Promise.resolve([
        {
          id: 1,
          name: 'Jane Doe',
          email: 'hv3RU@example.com',
          password:
            '0bdb34e1b84c48c5.463a3483d77675d1284dc73d01176e5cfbc9dfd2b55afc675469c5395bdb0a5027b338346696c4be41aaa2baef2fa4751f7a1bb745905fbb222cd508734588a4',
        } as User,
      ]);
    };
    const user = await service.login('hv3RU@example.com', 'password');
    expect(user).toBeDefined();
  });
});
