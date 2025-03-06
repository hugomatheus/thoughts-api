import { Thought } from '../thought.entity';

describe('Thought Unit', () => {
  it('create domain thought', () => {
    const thought = new Thought({ userId: '1', content: 'content' });

    expect(thought).toBeDefined();
    expect(thought.id).toBeDefined();
    expect(thought.userId).toBe('1');
    expect(thought.content).toBe('content');
    expect(thought.createdAt).toBeInstanceOf(Date);
  });

  it('generate uuid', () => {
    const thought = new Thought({ userId: '1' });

    expect(thought.id).toBeDefined();
    expect(typeof thought.id).toBe('string');
  });

  it('create domain by createThought', () => {
    const thought = Thought.createThought({
      userId: '1',
      content: 'content',
    });

    expect(thought).toBeInstanceOf(Thought);
    expect(thought.userId).toBe('1');
    expect(thought.content).toBe('content');
  });
});
