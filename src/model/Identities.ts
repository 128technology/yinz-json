import * as _ from 'lodash';

import YinElement from '../util/YinElement';

interface IMember {
  base: string;
  description: string;
  name: string;
  prefix: string;
}

export interface IIdentity {
  description: string;
  name: string;
  prefix: string;
  label: string;
}

export default class Identities {
  public identities: Map<string, IIdentity[]>;

  constructor(el?: YinElement) {
    this.identities = new Map();

    if (el) {
      this.parseIdentitiesFromModel(el);
    }
  }

  public parseIdentitiesFromModel(el: YinElement) {
    const identities = (_(el.findChildren('identity'))
      .map(identity => {
        const descriptionEl = identity.findChild('description');
        const baseEl = identity.findChild('base');

        return {
          base: baseEl ? _.last(baseEl.name!.split(':')) : undefined,
          description: descriptionEl ? descriptionEl.text! : undefined,
          name: identity.name!,
          prefix: identity.modulePrefix!
        };
      })
      .groupBy('base')
      .mapValues((group: IMember[]) => {
        return group.map((member: IMember) => {
          const { description, name, prefix } = member;

          return {
            description,
            label: `${prefix}:${name}`,
            name,
            prefix
          };
        });
      })
      .value() as any) as Record<string, IIdentity[]>;

    this.identities = new Map(Object.entries(identities));
  }

  public getOptions(base: string) {
    const hasBase = this.identities.has(base);
    return !hasBase ? [] : this.identities.get(base)!.map(identity => identity.label);
  }
}
