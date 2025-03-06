import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { FollowerEntity } from '../../core/followers/infra/db/typeorm/follower.entity';
export class FollowersSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(FollowerEntity);
    await repository.insert([
      {
        followerId: '2279c31e-cfed-4ba2-b539-ed807f0877e3',
        followingId: '826844eb-9c94-4a7f-b868-b17065688aaa',
      },
      {
        followerId: '2279c31e-cfed-4ba2-b539-ed807f0877e3',
        followingId: '9d2eaae2-8000-483e-bcdf-f9d64b656b94',
      },
    ]);
  }
}
