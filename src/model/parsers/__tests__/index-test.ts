import { expect } from 'chai';

import YinElement from '../../../util/YinElement';
import { Visibility, OrderedBy, ContextNode, Status } from '../../../enum';

import * as Parsers from '../';

describe('Model Parsers', () => {
  describe('Visibility Parser', () => {
    it('should parse hidden nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'visibility', namespace: 'mock', text: 'hidden' }]
        },
        null
      );

      expect(Parsers.VisibilityParser.parse(el)).to.equal(Visibility.hidden);
    });

    it('should parse advanced nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'visibility', namespace: 'mock', text: 'advanced' }]
        },
        null
      );

      expect(Parsers.VisibilityParser.parse(el)).to.equal(Visibility.advanced);
    });

    it('should parse visible nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'visibility', namespace: 'mock', text: 'visible' }]
        },
        null
      );

      expect(Parsers.VisibilityParser.parse(el)).to.equal(Visibility.visible);
    });

    it('should parse nodes with missing visibility', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock'
        },
        null
      );

      expect(Parsers.VisibilityParser.parse(el)).to.equal(null);
    });
  });

  describe('Status Parser', () => {
    it('should parse current nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'status', namespace: 'mock', value: 'current' }]
        },
        null
      );

      expect(Parsers.StatusParser.parse(el)).to.equal(Status.current);
    });

    it('should parse deprecated nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'status', namespace: 'mock', value: 'deprecated' }]
        },
        null
      );

      expect(Parsers.StatusParser.parse(el)).to.equal(Status.deprecated);
    });

    it('should parse obsolete nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'status', namespace: 'mock', value: 'obsolete' }]
        },
        null
      );

      expect(Parsers.StatusParser.parse(el)).to.equal(Status.obsolete);
    });

    it('should parse nodes with no status', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock'
        },
        null
      );

      expect(Parsers.StatusParser.parse(el)).to.equal(null);
    });
  });

  describe('Max Elements Parser', () => {
    it('should parse max elements nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'max-elements', namespace: 'mock', value: '10' }]
        },
        null
      );

      expect(Parsers.MaxElementsParser.parse(el)).to.equal(10);
    });

    it('should parse missing max elements nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock'
        },
        null
      );

      expect(Parsers.MaxElementsParser.parse(el)).to.equal(null);
    });
  });

  describe('Min Elements Parser', () => {
    it('should parse min elements nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'min-elements', namespace: 'mock', value: '3' }]
        },
        null
      );

      expect(Parsers.MinElementsParser.parse(el)).to.equal(3);
    });

    it('should parse missing min elements nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock'
        },
        null
      );

      expect(Parsers.MinElementsParser.parse(el)).to.equal(0);
    });
  });

  describe('Description Parser', () => {
    it('should parse description nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'description', namespace: 'mock', text: 'This cow moos.' }]
        },
        null
      );

      expect(Parsers.DescriptionParser.parse(el)).to.equal('This cow moos.');
    });

    it('should convert newlines to spaces', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'description', namespace: 'mock', text: 'This cow\npoos.' }]
        },
        null
      );

      expect(Parsers.DescriptionParser.parse(el)).to.equal('This cow poos.');
    });
  });

  describe('Reference Parser', () => {
    it('should parse reference nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'reference', namespace: 'mock', text: 'RFC1997' }]
        },
        null
      );

      expect(Parsers.ReferenceParser.parse(el)).to.equal('RFC1997');
    });

    it('should convert newlines to spaces', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'reference', namespace: 'mock', text: 'RFC\npoos.' }]
        },
        null
      );

      expect(Parsers.ReferenceParser.parse(el)).to.equal('RFC poos.');
    });
  });

  describe('Ordered By Parser', () => {
    it('should parse user nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'ordered-by', namespace: 'mock', value: 'user' }]
        },
        null
      );

      expect(Parsers.OrderedByParser.parse(el)).to.equal(OrderedBy.user);
    });

    it('should parse system nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'ordered-by', namespace: 'mock', value: 'system' }]
        },
        null
      );

      expect(Parsers.OrderedByParser.parse(el)).to.equal(OrderedBy.system);
    });

    it('should parse nodes with missing ordered by', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock'
        },
        null
      );

      expect(Parsers.OrderedByParser.parse(el)).to.equal(OrderedBy.system);
    });
  });

  describe('Mandatory Parser', () => {
    it('should parse mandatory true nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'mandatory', namespace: 'mock', value: 'true' }]
        },
        null
      );

      expect(Parsers.MandatoryParser.parse(el)).to.equal(true);
    });

    it('should parse mandatory false nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'mandatory', namespace: 'mock', value: 'false' }]
        },
        null
      );

      expect(Parsers.MandatoryParser.parse(el)).to.equal(false);
    });

    it('should parse missing mandatory node', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock'
        },
        null
      );

      expect(Parsers.MandatoryParser.parse(el)).to.equal(false);
    });
  });

  describe('Units Parser', () => {
    it('should parse nodes with units', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'units', namespace: 'mock', name: 'seconds' }]
        },
        null
      );

      expect(Parsers.UnitsParser.parse(el)).to.equal('seconds');
    });

    it('should parse nodes without units', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock'
        },
        null
      );

      expect(Parsers.UnitsParser.parse(el)).to.equal(null);
    });
  });

  describe('When Parser', () => {
    it('should parse the context node', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'when', namespace: 'mock', condition: 'count(../type) = 1', 'context-node': 'parent' }]
        },
        null
      );

      expect(Parsers.WhenParser.parse(el)).to.deep.equal([
        { condition: 'count(../type) = 1', context: ContextNode.parent }
      ]);
    });

    it('should parse multiple when nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [
            { keyword: 'when', namespace: 'mock', condition: "../type = 'foo'" },
            { keyword: 'when', namespace: 'mock', condition: "../type = 'bar'" }
          ]
        },
        null
      );

      expect(Parsers.WhenParser.parse(el)).to.deep.equal([
        { condition: "../type = 'foo'", context: null },
        { condition: "../type = 'bar'", context: null }
      ]);
    });

    it('should parse no when nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock'
        },
        null
      );

      expect(Parsers.WhenParser.parse(el)).to.equal(null);
    });

    it('should detect if element self has a when statement', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'when', namespace: 'mock', condition: "../type = 'foo'" }]
        },
        null
      );

      expect(Parsers.WhenParser.hasWhenAncestorOrSelf(el)).to.equal(true);
    });

    it('should detect if element self has no when statement', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock'
        },
        null
      );

      expect(Parsers.WhenParser.hasWhenAncestorOrSelf(el)).to.equal(false);
    });

    it('should detect if element ancestor has a when statement', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [
            { keyword: 'when', namespace: 'mock', condition: "../type = 'foo'" },
            {
              keyword: 'mock',
              namespace: 'mock',
              children: [
                {
                  keyword: 'mock',
                  namespace: 'mock'
                }
              ]
            }
          ]
        },
        null
      );

      expect(Parsers.WhenParser.hasWhenAncestorOrSelf(el.children[1].children[0]!)).to.equal(true);
    });

    it('should detect if element ancestor has no when statement', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [
            {
              keyword: 'mock',
              namespace: 'mock',
              children: [
                {
                  keyword: 'mock',
                  namespace: 'mock'
                }
              ]
            }
          ]
        },
        null
      );

      expect(Parsers.WhenParser.hasWhenAncestorOrSelf(el.children[0].children[0]!)).to.equal(false);
    });
  });

  describe('Presence Parser', () => {
    it('should parse presence true nodes', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'presence', namespace: 'mock', value: 'The reason.' }]
        },
        null
      );

      expect(Parsers.PresenceParser.parse(el)).to.equal('The reason.');
    });

    it('should parse nodes that have no presence', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock'
        },
        null
      );
      expect(Parsers.PresenceParser.parse(el)).to.equal(null);
    });
  });

  describe('Default Parser', () => {
    it('should parse default values if they exist', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'default', namespace: 'mock', value: '0' }]
        },
        null
      );

      expect(Parsers.DefaultParser.parse(el)).to.equal('0');
    });

    it('should return null if default node does not exist', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock'
        },
        null
      );

      expect(Parsers.DefaultParser.parse(el)).to.equal(null);
    });
  });

  describe('Unique Parser', () => {
    it('should parse one unique node with one child tag', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [{ keyword: 'unique', namespace: 'mock', tag: 'foo' }]
        },
        null
      );

      expect(Array.from(Parsers.UniqueParser.parse(el).entries())).to.deep.equal([['foo', []]]);
    });

    it('should parse multiple unique nodes with one child tag', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [
            { keyword: 'unique', namespace: 'mock', tag: 'foo' },
            { keyword: 'unique', namespace: 'mock', tag: 'bar' }
          ]
        },
        null
      );

      expect(Array.from(Parsers.UniqueParser.parse(el).entries())).to.deep.equal([
        ['foo', []],
        ['bar', []]
      ]);
    });

    it('should parse multiple unique nodes with multiple child tags', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [
            { keyword: 'unique', namespace: 'mock', tag: 'foo bizz' },
            { keyword: 'unique', namespace: 'mock', tag: 'bar' }
          ]
        },
        null
      );

      expect(Array.from(Parsers.UniqueParser.parse(el).entries())).to.deep.equal([
        ['foo', ['bizz']],
        ['bizz', ['foo']],
        ['bar', []]
      ]);
    });

    it('should parse no unique element', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock'
        },
        null
      );

      expect(Array.from(Parsers.UniqueParser.parse(el).entries())).to.deep.equal([]);
    });
  });

  describe('Namespaces Parser', () => {
    it('should aggregate all namespaces from a model', () => {
      const el = new YinElement(
        {
          keyword: 'mock',
          namespace: 'mock',
          children: [
            {
              keyword: 'container',
              namespace: 'mock',
              nsmap: { ps: 'http://128technology.com/t128/popsickle-sticks' },
              'module-prefix': 'ps',
              children: [
                {
                  keyword: 'container',
                  namespace: 'mock',
                  nsmap: { ss: 'http://128technology.com/t128/swizzle-sticks' },
                  'module-prefix': 'ss'
                }
              ]
            },
            {
              keyword: 'list',
              namespace: 'mock',
              nsmap: { ws: 'http://128technology.com/t128/walking-sticks' },
              'module-prefix': 'ws'
            }
          ]
        },
        null
      );

      expect(Parsers.NamespacesParser.parse(el)).to.deep.equal({
        ps: 'http://128technology.com/t128/popsickle-sticks',
        ss: 'http://128technology.com/t128/swizzle-sticks',
        ws: 'http://128technology.com/t128/walking-sticks'
      });
    });

    it('should get namespace from a module', () => {
      const el = new YinElement(
        {
          keyword: 'container',
          namespace: 'mock',
          nsmap: { ps: 'http://128technology.com/t128/popsickle-sticks' },
          'module-prefix': 'ps',
          children: [
            {
              keyword: 'container',
              namespace: 'mock',
              nsmap: { ps: 'http://128technology.com/t128/swizzle-sticks' },
              'module-prefix': 'ss'
            }
          ]
        },
        null
      );

      expect(Parsers.NamespacesParser.getNamespaceFromModule(el)).to.deep.equal([
        'ps',
        'http://128technology.com/t128/popsickle-sticks'
      ]);
    });

    it('should get namespace for a field in a module', () => {
      const el = new YinElement(
        {
          keyword: 'container',
          namespace: 'mock',
          nsmap: { ps: 'http://128technology.com/t128/popsickle-sticks' },
          'module-prefix': 'ps',
          children: [
            {
              keyword: 'container',
              namespace: 'mock',
              children: [
                {
                  keyword: 'leaf',
                  namespace: 'mock'
                }
              ]
            }
          ]
        },
        null
      );

      expect(Parsers.NamespacesParser.getNamespace(el.children[0].children[0])).to.deep.equal([
        'ps',
        'http://128technology.com/t128/popsickle-sticks'
      ]);
    });
  });
});
