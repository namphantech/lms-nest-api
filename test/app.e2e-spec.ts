import { AppModule } from 'src/AppModule';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('Test E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
  });

  it('should initialize the app', () => {
    expect(app).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should close the app', () => {
    expect(app).toBeDefined();
  });
});
