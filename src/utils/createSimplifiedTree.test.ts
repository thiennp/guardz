import { createSimplifiedTree } from './createSimplifiedTree';
import { createTreeNode } from './createTreeNode';

describe('createSimplifiedTree', () => {
  it('should simplify nested object trees recursively', () => {
    const tree = createTreeNode('user', false, 'object', {
      name: 123,
      profile: { age: '30' },
    });
    tree.children = {
      name: createTreeNode('user.name', false, 'string', 123),
      profile: createTreeNode('user.profile', false, 'object', { age: '30' }),
    };
    tree.children.profile.children = {
      age: createTreeNode('user.profile.age', false, 'number', '30'),
    };

    expect(createSimplifiedTree(tree)).toEqual({
      user: {
        valid: false,
        value: {
          name: {
            valid: false,
            value: 123,
            expectedType: 'string',
          },
          profile: {
            valid: false,
            value: {
              age: {
                valid: false,
                value: '30',
                expectedType: 'number',
              },
            },
            expectedType: 'object',
          },
        },
      },
    });
  });

  it('should simplify primitive root nodes', () => {
    const tree = createTreeNode('value', false, 'string', 123);

    expect(createSimplifiedTree(tree)).toEqual({
      value: {
        valid: false,
        value: 123,
        expectedType: 'string',
      },
    });
  });

  it('should fall back to root when path has no segments', () => {
    const tree = createTreeNode('', true, 'string', 'ok');

    expect(createSimplifiedTree(tree)).toEqual({
      root: {
        valid: true,
        value: 'ok',
        expectedType: 'string',
      },
    });
  });
});
