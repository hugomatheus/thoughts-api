import { runSeeders } from 'typeorm-extension';
import { AppDataSource } from './data-source';
import { UsersSeed } from './seeds/users.seed';
import { FollowersSeed } from './seeds/followers.seed';
import { ThoughtsSeed } from './seeds/thoughts.seed';

void (async () => {
  await AppDataSource.initialize();

  await runSeeders(AppDataSource, {
    seeds: [UsersSeed, FollowersSeed, ThoughtsSeed],
  });
})();
