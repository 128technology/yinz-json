import YinElement from '../../util/YinElement';
import { WhenParser } from '../parsers';
import { ContextNode } from '../../enum';

export interface IWhen {
  condition: string;
  context: ContextNode | null;
}

export default class Whenable {
  public when: IWhen[] | null;
  public hasWhenAncestorOrSelf: boolean;

  public addWhenableProps(el: YinElement) {
    this.when = WhenParser.parse(el);
    this.hasWhenAncestorOrSelf = WhenParser.hasWhenAncestorOrSelf(el);
  }
}
