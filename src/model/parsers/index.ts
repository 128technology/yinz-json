import * as _ from 'lodash';

import { OrderedBy, Visibility, Status } from '../../enum';
import { enumValueOf } from '../../enum/ContextNode';
import YinElement from '../../util/YinElement';

export { default as TypeParser } from '../../types/util/TypeParser';

export class VisibilityParser {
  public static parse(el: YinElement): Visibility | null {
    const visibility = el.findChild('visibility');
    return visibility ? Visibility[visibility.text as keyof typeof Visibility] : null;
  }
}

export class StatusParser {
  public static parse(el: YinElement) {
    const status = el.findChild('status');
    return status ? Status[status.value as keyof typeof Status] : null;
  }
}

export class MaxElementsParser {
  public static parse(el: YinElement) {
    const maxElem = el.findChild('max-elements');
    return maxElem ? parseInt(maxElem.value!, 10) : null;
  }
}

export class MinElementsParser {
  public static parse(el: YinElement) {
    const minElem = el.findChild('min-elements');
    return minElem ? parseInt(minElem.value!, 10) : 0;
  }
}

export class DescriptionParser {
  public static convertNewlinesToSpaces(stringToReplace: string) {
    return stringToReplace.replace(/(\r\n|\n|\r)/gm, ' ');
  }

  public static parse(el: YinElement) {
    const description = el.findChild('description')?.text;
    return description ? DescriptionParser.convertNewlinesToSpaces(description) : null;
  }
}

export class UniqueParser {
  public static parse(el: YinElement) {
    const uniqueEls = el.findChildren('unique');
    return uniqueEls
      ? uniqueEls
          .map(uniqueEl => uniqueEl.tag!)
          .reduce((acc, tag) => {
            const uniqueSet = tag.split(' ');

            uniqueSet.forEach(x => {
              acc.set(
                x,
                uniqueSet.filter(y => y !== x)
              );
            });

            return acc;
          }, new Map<string, string[]>())
      : new Map<string, string[]>();
  }
}

export class ReferenceParser {
  public static convertNewlinesToSpaces(stringToReplace: string) {
    return stringToReplace.replace(/(\r\n|\n|\r)/gm, ' ');
  }

  public static parse(el: YinElement) {
    const reference = el.findChild('reference')?.text;
    return reference ? ReferenceParser.convertNewlinesToSpaces(reference) : null;
  }
}

export class OrderedByParser {
  public static parse(el: YinElement) {
    const orderedBy = el.findChild('ordered-by');
    return orderedBy ? OrderedBy[orderedBy.value as keyof typeof OrderedBy] : OrderedBy.system;
  }
}

export class MandatoryParser {
  public static parse(el: YinElement) {
    const mandatory = el.findChild('mandatory');
    return mandatory ? mandatory.value === 'true' : false;
  }
}

export class UnitsParser {
  public static parse(el: YinElement) {
    const units = el.findChild('units');
    return units ? units.name! : null;
  }
}

export class DefaultParser {
  public static parse(el: YinElement) {
    const defaultEl = el.findChild('default');
    return defaultEl ? defaultEl.value! : null;
  }
}

export class PresenceParser {
  public static parse(el: YinElement) {
    const presence = el.findChild('presence');
    return presence ? presence.value! : null;
  }
}

export class NamespacesParser {
  public static getNamespace(el: YinElement): [string, string] {
    const moduleEl = el.getContainingModule()!;
    return this.getNamespaceFromModule(moduleEl);
  }

  public static getNamespaceFromModule(el: YinElement): [string, string] {
    const prefix = el.modulePrefix!;
    const href = el.nsmap![prefix];

    return [prefix, href];
  }

  public static parse(el: YinElement) {
    const nsEls = el.collectChildModules();

    return nsEls.reduce<Record<string, string>>((acc, nsEl) => {
      const [prefix, href] = NamespacesParser.getNamespaceFromModule(nsEl);
      acc[prefix] = href;
      return acc;
    }, {});
  }
}

export class WhenParser {
  public static parse(el: YinElement) {
    const whenEls = el.findChildren('when');

    if (whenEls && whenEls.length > 0) {
      return whenEls.map(({ condition, contextNode }) => {
        const context = contextNode ? enumValueOf(contextNode) : null;
        return { condition: condition!, context };
      });
    } else {
      return null;
    }
  }

  public static hasWhenAncestorOrSelf(el: YinElement) {
    return el.hasWhenAncestorOrSelf;
  }
}

export class PropertiesParser {
  public static isTextProperty(el: YinElement) {
    return el.children.length === 0 && el.text;
  }

  public static isPresenceProperty(el: YinElement) {
    return el.children.length === 0 && el.text === null;
  }

  public static parse(el: YinElement, ignoreList: string[]) {
    return el.children
      .filter(child => {
        if (_.includes(ignoreList, child.keyword)) {
          return false;
        }

        if (PropertiesParser.isTextProperty(child) || PropertiesParser.isPresenceProperty(child)) {
          return true;
        }

        return false;
      })
      .reduce((acc, child) => {
        const name = _.camelCase(child.keyword);

        if (PropertiesParser.isTextProperty(child)) {
          acc.set(name, child.text);
        } else if (PropertiesParser.isPresenceProperty(child)) {
          acc.set(name, true);
        }

        return acc;
      }, new Map());
  }
}
