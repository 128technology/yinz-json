import * as _ from 'lodash';

import Path, { isKeyedSegment, PathSegment } from '../Path';
import { LeafInstance, ListChildInstance, LeafListInstance } from '../';
import { JSONMapper, Authorized } from '../types';

export function getPathXPath(path: Path) {
  const tail = path.map(segment => getSegmentXPath(segment)).join('/');
  return `//*[local-name()='config']/${tail}`;
}

export function getSegmentXPath(segment: PathSegment) {
  const { name } = segment;
  let keySelector = '';

  if (isKeyedSegment(segment)) {
    const keyInner = segment.keys.map(({ key, value }) => `*[local-name()='${key}']='${value}'`).join(' and ');
    keySelector = `[${keyInner}]`;
  }

  return `*[local-name()='${name}']${keySelector}`;
}

export const allow = () => true;

export function getDefaultMapper(authorized: Authorized) {
  const defaultMapper: JSONMapper = instance => {
    if (instance instanceof LeafInstance || instance instanceof LeafListInstance) {
      return instance.toJSON(authorized);
    } else if (instance instanceof ListChildInstance) {
      return [instance.toJSON(authorized)];
    }
  };

  return defaultMapper;
}
