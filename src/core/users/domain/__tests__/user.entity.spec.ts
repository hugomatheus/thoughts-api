import { User } from '../user.entity';

describe('User Unit', () => {
  it('create domain user', () => {
    const user = new User({ id: '1', name: 'name' });

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.id).toBe('1');
    expect(user.name).toBe('name');
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('generate uuid', () => {
    const user = new User({ name: 'name' });

    expect(user.id).toBeDefined();
    expect(typeof user.id).toBe('string');
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('create domain by createUser', () => {
    const user = User.createUser({
      name: 'name',
    });

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBeDefined();
    expect(user.name).toBe('name');
    expect(user.createdAt).toBeInstanceOf(Date);
  });
});
