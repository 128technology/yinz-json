import YinElement from '../util/YinElement';
import { Status } from '../enum';
import * as Parsers from '../model/parsers';

export default class EnumerationMemberType {
  public readonly description: string | null;
  public readonly value: number | null;
  public readonly reference: string | null;
  public readonly status: Status = Status.current;

  constructor(enumEl: YinElement) {
    this.status = Parsers.StatusParser.parse(enumEl) || Status.current;
    this.description = Parsers.DescriptionParser.parse(enumEl);
    this.reference = Parsers.ReferenceParser.parse(enumEl);
    this.value = this.parseValue(enumEl);
  }

  public isObsolete = () => this.status === Status.obsolete;

  public parseValue(enumEl: YinElement) {
    const valueEl = enumEl.findChild('value');
    return valueEl && valueEl.value ? parseInt(valueEl.value, 10) : null;
  }
}
