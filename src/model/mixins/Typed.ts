import YinElement from '../../util/YinElement';
import TypeParser from '../../types/util/TypeParser';
import { Type } from '../../types';
import { Identities } from '../';

export default class Typed {
  public type: Type;

  public addTypeProps(el: YinElement, identities: Identities) {
    const type = el.findChild('type', 'urn:ietf:params:xml:ns:yang:yin:1')!;
    this.type = TypeParser.parse(type, identities);
  }
}
