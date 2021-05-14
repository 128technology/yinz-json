import { expect } from 'chai';

import YinElement from '../../../util/YinElement';
import applyMixins from '../../../util/applyMixins';
import { Visibility, Status } from '../../../enum';

import { Statement } from '../';
import { Leaf, Model, Case } from '../../';

describe('Statement Mixin', () => {
  class Test implements Statement {
    public name: string;
    public ns: [string, string];
    public description: string;
    public otherProps: Map<string, string | boolean>;
    public parentModel: Model;
    public path: string;
    public status: Status;
    public isObsolete: boolean;
    public isDeprecated: boolean;
    public isPrototype: boolean;
    public isVisible: boolean;
    public getName: (camelCase?: boolean) => string;
    public choiceCase: Case;

    public addStatementProps: (el: YinElement, parentModel: Model | null) => void;

    public visibility: Visibility | null;

    constructor(el: YinElement, parentModel: Model | null) {
      this.addStatementProps(el, parentModel);
    }
  }

  applyMixins(Test, [Statement]);

  const withDescription = new YinElement(
    {
      keyword: 'leaf',
      namespace: 'mock',
      name: 'name',
      'module-prefix': 'test',
      nsmap: { test: 'http://foo.bar' },
      children: [
        { keyword: 'help', namespace: 'mock', text: 'key identifier' },
        { keyword: 'test', namespace: 'mock', text: null },
        { keyword: 'status', namespace: 'mock', value: 'current' },
        { keyword: 'visibility', namespace: 'mock', text: 'visible' },
        {
          keyword: 'description',
          namespace: 'mock',
          text: 'An arbitrary, unique name for the tenant, used to reference it in other configuration sections.'
        },
        {
          keyword: 'type',
          namespace: 'mock',
          name: 'string'
        }
      ]
    },
    null
  );

  const withoutDescription = new YinElement(
    {
      keyword: 'leaf',
      namespace: 'mock',
      name: 'name',
      'module-prefix': 'test',
      nsmap: { test: 'http://foo.bar' },
      children: [
        { keyword: 'help', namespace: 'mock', text: 'key identifier' },
        {
          keyword: 'type',
          namespace: 'mock',
          name: 'string'
        }
      ]
    },
    null
  );

  const prototype = new YinElement(
    {
      keyword: 'leaf',
      namespace: 'mock',
      name: 'name',
      'module-prefix': 'test',
      nsmap: { test: 'http://foo.bar' },
      children: [
        { keyword: 'visibility', namespace: 'mock', text: 'prototype' },
        {
          keyword: 'type',
          namespace: 'mock',
          name: 'string'
        }
      ]
    },
    null
  );

  const obsolete = new YinElement(
    {
      keyword: 'leaf',
      namespace: 'mock',
      name: 'name',
      'module-prefix': 'test',
      nsmap: { test: 'http://foo.bar' },
      children: [
        { keyword: 'status', namespace: 'mock', value: 'obsolete' },
        {
          keyword: 'type',
          namespace: 'mock',
          name: 'string'
        }
      ]
    },
    null
  );

  const deprecated = new YinElement(
    {
      keyword: 'leaf',
      namespace: 'mock',
      name: 'name',
      'module-prefix': 'test',
      nsmap: { test: 'http://foo.bar' },
      children: [
        { keyword: 'status', namespace: 'mock', value: 'deprecated' },
        {
          keyword: 'type',
          namespace: 'mock',
          name: 'string'
        }
      ]
    },
    null
  );

  const withKebabCase = new YinElement(
    {
      keyword: 'leaf',
      namespace: 'mock',
      name: 'name-with-dashes',
      'module-prefix': 'test',
      nsmap: { test: 'http://foo.bar' }
    },
    null
  );

  it('should get the name from a statement', () => {
    const statement = new Test(withDescription, null);

    expect(statement.name).to.equal('name');
  });

  it('should get the description from a statement', () => {
    const statement = new Test(withDescription, null);

    expect(statement.description).to.equal(
      'An arbitrary, unique name for the tenant, used to reference it in other configuration sections.'
    );
  });

  it('should handle no description being set', () => {
    const statement = new Test(withoutDescription, null);

    expect(statement.description).to.equal(null);
  });

  it('should have a path if deeply nested', () => {
    const statement = new Test(withoutDescription, { path: 'foo.bar' } as Leaf);

    expect(statement.path).to.equal('foo.bar.name');
  });

  it('should have a path if root', () => {
    const statement = new Test(withoutDescription, null);

    expect(statement.path).to.equal('name');
  });

  it('should have a status', () => {
    const statement = new Test(withDescription, null);

    expect(statement.status).to.equal(Status.current);
  });

  describe('#isObsolete()', () => {
    it('should determine if a field itself is obsolete', () => {
      const statement = new Test(obsolete, null);

      expect(statement.isObsolete).to.equal(true);
    });

    it('should determine if a field is obsolete if it has an obsolete ancestor', () => {
      const statement = new Test(withoutDescription, { isObsolete: true } as Leaf);

      expect(statement.isObsolete).to.equal(true);
    });

    it('should determine if a field is obsolete if it is in an obsolete case', () => {
      const statement = new Test(withoutDescription, null);
      statement.choiceCase = { isObsolete: true } as Case;

      expect(statement.isObsolete).to.equal(true);
    });

    it('should determine if a field is not obsolete', () => {
      const statement = new Test(withoutDescription, null);

      expect(statement.isObsolete).to.equal(false);
    });
  });

  describe('#isDeprecated()', () => {
    it('should determine if a field itself is deprecated', () => {
      const statement = new Test(deprecated, null);

      expect(statement.isDeprecated).to.equal(true);
    });

    it('should determine if a field is deprecated if it has a deprecated ancestor', () => {
      const statement = new Test(withoutDescription, { isDeprecated: true } as Leaf);

      expect(statement.isDeprecated).to.equal(true);
    });

    it('should determine if a field is deprecated if it is in an deprecated case', () => {
      const statement = new Test(withoutDescription, null);
      statement.choiceCase = { isDeprecated: true } as Case;

      expect(statement.isDeprecated).to.equal(true);
    });

    it('should determine if a field is not deprecated', () => {
      const statement = new Test(withoutDescription, null);

      expect(statement.isDeprecated).to.equal(false);
    });
  });

  describe('#isVisible()', () => {
    it('should determine its visibility if specified', () => {
      const statement = new Test(withDescription, null);

      expect(statement.isVisible).to.equal(true);
    });

    it('should determine its visibility if not specified and parent case hidden', () => {
      const statement = new Test(withoutDescription, null);
      statement.choiceCase = { isVisible: false } as Case;

      expect(statement.isVisible).to.equal(false);
    });

    it('should determine its visibility if not specified and parent case visible', () => {
      const statement = new Test(withoutDescription, null);
      statement.choiceCase = { isVisible: true } as Case;

      expect(statement.isVisible).to.equal(true);
    });

    it('should determine its visibility if not specified and parent hidden', () => {
      const statement = new Test(withoutDescription, { isVisible: false } as Leaf);

      expect(statement.isVisible).to.equal(false);
    });

    it('should determine its visibility if not specified and parent visible', () => {
      const statement = new Test(withoutDescription, { isVisible: true } as Leaf);

      expect(statement.isVisible).to.equal(true);
    });

    it('should determine its visibility if not specified and parent not specified', () => {
      const statement = new Test(withoutDescription, null);

      expect(statement.isVisible).to.equal(true);
    });
  });

  describe('#isPrototype()', () => {
    it('should determine if it is not a prototype', () => {
      const statement = new Test(withoutDescription, null);

      expect(statement.isPrototype).to.equal(false);
    });

    it('should determine if it is a prototype', () => {
      const statement = new Test(prototype, null);

      expect(statement.isPrototype).to.equal(true);
    });

    it('should defer to its case if in a choice to determine if it is a prototype', () => {
      const statement = new Test(withoutDescription, null);
      statement.choiceCase = { isPrototype: true } as Case;

      expect(statement.isPrototype).to.equal(true);
    });

    it('should defer to its ancestor to determine if it is a prototype', () => {
      const statement = new Test(withoutDescription, { isPrototype: true } as Leaf);

      expect(statement.isPrototype).to.equal(true);
    });
  });

  it('should get its name as camel case', () => {
    const statement = new Test(withKebabCase, null);

    expect(statement.getName(true)).to.equal('nameWithDashes');
  });

  it('should get its name', () => {
    const statement = new Test(withKebabCase, null);

    expect(statement.getName(false)).to.equal('name-with-dashes');
  });

  it('should get its namespace', () => {
    const el = new YinElement(
      {
        keyword: 'container',
        namespace: 'mock',
        name: 'popsickle',
        'module-prefix': 'ps',
        nsmap: { ps: 'http://128technology.com/t128/popsickle-sticks' },
        children: [
          {
            keyword: 'container',
            namespace: 'mock',
            name: 'foo',
            children: [
              {
                keyword: 'leaf',
                namespace: 'mock',
                name: 'bar'
              }
            ]
          }
        ]
      },
      null
    );
    const statement = new Test(el.children[0].children[0], null);

    expect(statement.ns).to.deep.equal(['ps', 'http://128technology.com/t128/popsickle-sticks']);
  });

  it('should parse text and presence properties', () => {
    const statement = new Test(withDescription, null);

    expect(statement.otherProps.get('help')).to.equal('key identifier');
    expect(statement.otherProps.get('test')).to.equal(true);
  });
});
