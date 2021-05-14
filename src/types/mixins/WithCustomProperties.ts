import YinElement from '../../util/YinElement';
import { PropertiesParser } from '../../model/parsers';

export default class WithCustomProperties {
  public otherProps: Map<string, string | boolean>;

  public addCustomProperties(el: YinElement, ignoreList: string[] = []) {
    this.otherProps = PropertiesParser.parse(el, ignoreList);
  }
}
