import { expect } from 'chai';
import { Element } from 'libxmljs';

import xmlUtil, { yinNS, t128InternalNS } from '../../../__tests__/xmlUtil';
import applyMixins from '../../../util/applyMixins';
import { Visibility, Status } from '../../../enum';
import ns from '../../../util/ns';

import { Statement } from '../';
import { Leaf, Model, Case } from '../../';

describe('Statement Mixin', () => {
  class Test implements Statement {
    public name: string;
    public ns: [string, string];
    public description: string;
    public otherProps: Map<string, string | boolean>;
    public parentModel: Model;
    public path: string;
    public status: Status;
    public isObsolete: boolean;
    public isPrototype: boolean;
    public isVisible: boolean;
    public getName: (camelCase?: boolean) => string;
    public choiceCase: Case;

    public addStatementProps: (el: Element, parentModel: Model) => void;

    public visibility: Visibility | null;

    constructor(el: Element, parentModel?: Model) {
      this.addStatementProps(el, parentModel);
    }
  }

  applyMixins(Test, [Statement]);

  /* tslint:disable:max-line-length */
  const withDescription = xmlUtil.toElement(`
    <yin:leaf name="name" ${yinNS}>
      <yin:type name="t128ext:tenant-name">
        <yin:typedef name="tenant-name">
          <yin:description>
            <yin:text>A string identifier for a tenant, which uses alphanumerics, underscores,
dots, or dashes, and cannot exceed 253 characters (similar to domain-name).</yin:text>
          </yin:description>
          <yin:type name="string">
            <yin:pattern value="((([a-zA-Z0-9]([a-zA-Z0-9\-_]){0,61})?[a-zA-Z0-9]\.)*([a-zA-Z0-9]([a-zA-Z0-9\-_]){0,61})?[a-zA-Z0-9])?">
              <yin:error-message>
                <yin:value>Must contain only alphanumeric characters or any of the following: - _ .</yin:value>
              </yin:error-message>
            </yin:pattern>
            <yin:length value="0..253"/>
          </yin:type>
        </yin:typedef>
      </yin:type>
      <t128ext:help>key identifier</t128ext:help>
      <t128ext:test/>
      <yin:status>current</yin:status>
      <t128-internal:visibility>visible</t128-internal:visibility>
      <yin:description>
        <yin:text>An arbitrary, unique name for the tenant, used to reference
it in other configuration sections.</yin:text>
      </yin:description>
    </yin:leaf>
  `);

  const withoutDescription = xmlUtil.toElement(`
    <yin:leaf name="name" ${yinNS}>
      <yin:type name="t128ext:tenant-name">
        <yin:typedef name="tenant-name">
          <yin:description>
            <yin:text>A string identifier for a tenant, which uses alphanumerics, underscores,
dots, or dashes, and cannot exceed 253 characters (similar to domain-name).</yin:text>
          </yin:description>
          <yin:type name="string">
            <yin:pattern value="((([a-zA-Z0-9]([a-zA-Z0-9\-_]){0,61})?[a-zA-Z0-9]\.)*([a-zA-Z0-9]([a-zA-Z0-9\-_]){0,61})?[a-zA-Z0-9])?">
              <yin:error-message>
                <yin:value>Must contain only alphanumeric characters or any of the following: - _ .</yin:value>
              </yin:error-message>
            </yin:pattern>
            <yin:length value="0..253"/>
          </yin:type>
        </yin:typedef>
      </yin:type>
      <t128ext:help>key identifier</t128ext:help>
    </yin:leaf>
  `);

  const prototype = xmlUtil.toElement(`
    <yin:leaf name="name" ${yinNS} ${t128InternalNS}>
      <yin:type name="string" />
      <t128-internal:visibility>prototype</t128-internal:visibility>
    </yin:leaf>
  `);

  const obsolete = xmlUtil.toElement(`
    <yin:leaf name="name" ${yinNS}>
      <yin:type name="string" />
      <yin:status>obsolete</yin:status>
    </yin:leaf>
  `);
  /* tslint:enable:max-line-length */

  const withKebabCase = xmlUtil.toElement(`
    <yin:leaf name="name-with-dashes" ${yinNS}></yin:leaf>
  `);

  it('should get the name from a statement', () => {
    const statement = new Test(withDescription);

    expect(statement.name).to.equal('name');
  });

  it('should get the description from a statement', () => {
    const statement = new Test(withDescription);

    expect(statement.description).to.equal(
      'An arbitrary, unique name for the tenant, used to reference it in other configuration sections.'
    );
  });

  it('should handle no description being set', () => {
    const statement = new Test(withoutDescription);

    expect(statement.description).to.equal(null);
  });

  it('should have a path if deeply nested', () => {
    const statement = new Test(withoutDescription, { path: 'foo.bar' } as Leaf);

    expect(statement.path).to.equal('foo.bar.name');
  });

  it('should have a path if root', () => {
    const statement = new Test(withoutDescription);

    expect(statement.path).to.equal('name');
  });

  it('should have a status', () => {
    const statement = new Test(withDescription);

    expect(statement.status).to.equal(Status.current);
  });

  it('should determine if a field itself is obsolete', () => {
    const statement = new Test(obsolete);

    expect(statement.isObsolete).to.equal(true);
  });

  it('should determine if a field is obsolete if it has an obsolete ancestor', () => {
    const statement = new Test(withoutDescription, { isObsolete: true } as Leaf);

    expect(statement.isObsolete).to.equal(true);
  });

  it('should determine if a field is not obsolete', () => {
    const statement = new Test(withoutDescription);

    expect(statement.isObsolete).to.equal(false);
  });

  it('should determine its visibility if specified', () => {
    const statement = new Test(withDescription);

    expect(statement.isVisible).to.equal(true);
  });

  it('should determine its visibility if not specified and parent hidden', () => {
    const statement = new Test(withoutDescription, { isVisible: false } as Leaf);

    expect(statement.isVisible).to.equal(false);
  });

  it('should determine its visibility if not specified and parent visible', () => {
    const statement = new Test(withoutDescription, { isVisible: true } as Leaf);

    expect(statement.isVisible).to.equal(true);
  });

  it('should determine its visibility if not specified and parent not specified', () => {
    const statement = new Test(withoutDescription);

    expect(statement.isVisible).to.equal(true);
  });

  it('should determine if it is not a prototype', () => {
    const statement = new Test(withoutDescription);

    expect(statement.isPrototype).to.equal(false);
  });

  it('should determine if it is a prototype', () => {
    const statement = new Test(prototype);

    expect(statement.isPrototype).to.equal(true);
  });

  it('should defer to its ancestor to determine if it is a prototype', () => {
    const statement = new Test(withoutDescription, { isPrototype: true } as Leaf);

    expect(statement.isPrototype).to.equal(true);
  });

  it('should get its name as camel case', () => {
    const statement = new Test(withKebabCase);

    expect(statement.getName(true)).to.equal('nameWithDashes');
  });

  it('should get its name', () => {
    const statement = new Test(withKebabCase);

    expect(statement.getName(false)).to.equal('name-with-dashes');
  });

  it('should get its namespace', () => {
    const el = xmlUtil.toElement(`
        <yin:container ${yinNS} xmlns:ps="http://128technology.com/t128/popsickle-sticks" name="popsickle" module-prefix="ps">
          <yin:container name="foo">
            <yin:leaf name="bar">test</yin:leaf>
          </yin:container>
        </yin:container>
      `);
    const statement = new Test(el.get('//yin:leaf', ns));

    expect(statement.ns).to.deep.equal(['ps', 'http://128technology.com/t128/popsickle-sticks']);
  });

  it('should parse text and presence properties', () => {
    const statement = new Test(withDescription);

    expect(statement.otherProps.get('help')).to.equal('key identifier');
    expect(statement.otherProps.get('test')).to.equal(true);
  });
});
