import * as _ from 'lodash';

import YinElement from '../../util/YinElement';

export default class RequiredField {
  public validateRequiredFields(el: YinElement, fields: string[] = [], type: string) {
    fields.forEach(field => {
      const fieldEl = el.findChild(field);

      if (_.isNil(fieldEl)) {
        throw new Error(`${type || 'The given'} type must specify ${field}.`);
      }
    });
  }
}
