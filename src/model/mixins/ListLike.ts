import YinElement from '../../util/YinElement';
import { OrderedBy } from '../../enum';
import { MaxElementsParser, MinElementsParser, OrderedByParser } from '../parsers';

export default class ListLike {
  public maxElements: number | null;
  public minElements: number;
  public orderedBy: OrderedBy;

  public addListLikeProps(el: YinElement) {
    this.orderedBy = OrderedByParser.parse(el);
    this.maxElements = MaxElementsParser.parse(el);
    this.minElements = MinElementsParser.parse(el);
  }
}
