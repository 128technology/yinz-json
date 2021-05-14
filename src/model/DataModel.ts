import { NamespacesParser } from './parsers';
import { Container, Model, Choice, Identities, ModelRegistry, Visitor } from './';
import YinElement, { RawYinElement } from '../util/YinElement';

function parseConsolidatedModel(model: YinElement, identities: Identities, modelRegistry: ModelRegistry) {
  const rootContainer = new Container(model, undefined, identities, modelRegistry);

  const root = new Map();
  root.set(rootContainer.name, rootContainer);

  return root;
}

export interface IOptions {
  modelElement: RawYinElement;
  getRoot: (document: YinElement) => YinElement;
}

export default class DataModel {
  public root: Map<string, Container>;
  public identities: Identities;
  public namespaces: { [s: string]: string };
  public modelRegistry: ModelRegistry;

  constructor(options: IOptions) {
    const { modelElement, getRoot } = options;
    const modelYinElement = new YinElement(modelElement, null);
    const rootYinElement = getRoot(modelYinElement);

    this.identities = new Identities(modelYinElement);
    this.namespaces = NamespacesParser.parse(modelYinElement);
    this.modelRegistry = new ModelRegistry();

    this.root = parseConsolidatedModel(rootYinElement, this.identities, this.modelRegistry);
  }

  public getModelForPath(path: string): Model | Choice {
    if (this.modelRegistry.registry.has(path)) {
      return this.modelRegistry.registry.get(path)!;
    } else {
      throw new Error(`Model not found for path ${path}`);
    }
  }

  public visit(visitor: Visitor) {
    for (const value of this.root.values()) {
      value.visit(visitor);
    }
  }
}
