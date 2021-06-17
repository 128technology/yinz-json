import * as _ from 'lodash';

import DataModel, { Choice } from '../model';
import Path from './Path';
import { ContainerInstance, Visitor, NoMatchHandler, ShouldSkip } from './';
import { ContainerJSON, JSONMapper, MapToJSONOptions, Authorized, IInstanceOptions } from './types';
import { getDefaultMapper } from './util';

export default class DataModelInstance {
  public root: Map<string, ContainerInstance> = new Map();

  constructor(
    public model: DataModel,
    instance: { [rootName: string]: ContainerJSON },
    private options: IInstanceOptions = {
      jsonMode: {
        evaluateWhenCondition: () => Promise.resolve(true),
        evaluateLeafRef: () => Promise.resolve([]),
        evaluateSuggestionRef: () => Promise.resolve([]),
        resolveLeafRefPath: () => Promise.resolve([])
      }
    }
  ) {
    const rootName = [...model.root.keys()][0];
    const modelRoot = model.root.get(rootName)!;

    this.root.set(rootName, new ContainerInstance(modelRoot, Object.values(instance)[0], null));
  }

  public toJSON(authorized: Authorized, camelCase = false, convert = true, shouldSkip?: ShouldSkip): object {
    return [...this.root.values()][0].toJSON(authorized, camelCase, convert, shouldSkip);
  }

  public mapToJSON(
    authorized: Authorized,
    map: JSONMapper = getDefaultMapper(authorized),
    options: MapToJSONOptions = { overrideOnKeyMap: false }
  ) {
    return [...this.root.values()][0].mapToJSON(authorized, map, options);
  }

  public async resolveLeafRefPath(path: Path, context?: unknown) {
    return this.options.jsonMode.resolveLeafRefPath(path, context);
  }

  public async evaluateWhenCondition(path: Path, context?: unknown) {
    const model = this.model.getModelForPath(path.map(({ name }) => name).join('.'));
    let evaluationPath = path;
    if (!model.hasWhenAncestorOrSelf) {
      return true;
    } else if (model instanceof Choice) {
      evaluationPath = _.initial(path);
    }

    return this.options.jsonMode.evaluateWhenCondition(evaluationPath, context);
  }

  public async evaluateLeafRef(path: Path, context?: unknown) {
    return this.options.jsonMode.evaluateLeafRef(path, context);
  }

  public async evaluateSuggestionRef(path: Path, context?: unknown) {
    return this.options.jsonMode.evaluateSuggestionRef(path, context);
  }

  public getInstance(path: Path, noMatchHandler?: NoMatchHandler) {
    if (path.length > 0) {
      const firstSegmentName = path[0].name;

      if (this.root.has(firstSegmentName)) {
        return this.root.get(firstSegmentName)!.getInstance(path, noMatchHandler);
      } else {
        throw new Error(`Path must start with ${[...this.root.keys()][0]}.`);
      }
    } else {
      throw new Error('Path length must be greater than 0.');
    }
  }

  public visit(visitor: Visitor) {
    Array.from(this.root.values()).forEach(child => {
      child.visit(visitor);
    });
  }
}
