import YinElement from '../../util/YinElement';

export default class Named {
  public type: string;

  public addNamedProps(el: YinElement) {
    this.type = el.name!;
  }
}
