import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../core/users/infra/db/typeorm/user.entity';

export class UsersSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);
    await repository.insert([
      {
        id: '2279c31e-cfed-4ba2-b539-ed807f0877e3',
        name: 'User1',
        createdAt: new Date(),
      },
      {
        id: '826844eb-9c94-4a7f-b868-b17065688aaa',
        name: 'User2',
        createdAt: new Date(),
      },
      {
        id: '9d2eaae2-8000-483e-bcdf-f9d64b656b94',
        name: 'User3',
        createdAt: new Date(),
      },
    ]);
  }
}
