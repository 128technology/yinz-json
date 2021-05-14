import { expect } from 'chai';

import YinElement from '../../../util/YinElement';
import applyMixins from '../../../util/applyMixins';
import { Whenable } from '../';
import { IWhen } from '../Whenable';

describe('Whenable Mixin', () => {
  class Test implements Whenable {
    public when: IWhen[];
    public hasWhenAncestorOrSelf: boolean;

    public addWhenableProps: (el: YinElement) => void;
  }

  applyMixins(Test, [Whenable]);

  it('should add when conditions', () => {
    const el = new YinElement(
      {
        keyword: 'mock',
        namespace: 'mock',
        children: [{ keyword: 'when', namespace: 'mock', condition: 'count(../type) = 1' }]
      },
      null
    );
    const testModel = new Test();
    testModel.addWhenableProps(el);

    expect(testModel.when).to.deep.equal([{ condition: 'count(../type) = 1', context: null }]);
  });

  it('should add hasWhenAncestorOrSelf', () => {
    const el = new YinElement(
      {
        keyword: 'mock',
        namespace: 'mock',
        children: [{ keyword: 'when', namespace: 'mock', condition: 'count(../type) = 1' }]
      },
      null
    );
    const testModel = new Test();
    testModel.addWhenableProps(el);

    expect(testModel.hasWhenAncestorOrSelf).to.equal(true);
  });
});
