import { expect } from 'chai';

import { getPathXPath, getSegmentXPath } from '../';

describe('Instance Util', () => {
  describe('#getPathXPath()', () => {
    it('should get an XPath from a Path without keys', () => {
      const testPath = [{ name: 'authority' }, { name: 'session-type' }, { name: 'service-class' }];

      expect(getPathXPath(testPath)).to.equal(
        "//*[local-name()='config']/*[local-name()='authority']/*[local-name()='session-type']/*[local-name()='service-class']"
      );
    });

    it('should get an XPath from a Path with keys', () => {
      const testPath = [
        { name: 'authority' },
        { name: 'session-type', keys: [{ key: 'name', value: 'HTTPS' }] },
        { name: 'service-class' }
      ];

      expect(getPathXPath(testPath)).to.equal(
        "//*[local-name()='config']/*[local-name()='authority']/*[local-name()='session-type'][*[local-name()='name']='HTTPS']/*[local-name()='service-class']"
      );
    });

    it('should get an XPath from a Path with compound keys', () => {
      const testPath = [
        { name: 'authority' },
        {
          keys: [
            { key: 'name', value: 'HTTPS' },
            { key: 'foo', value: 'bar' }
          ],
          name: 'session-type'
        },
        { name: 'service-class' }
      ];

      expect(getPathXPath(testPath)).to.equal(
        "//*[local-name()='config']/*[local-name()='authority']/*[local-name()='session-type'][*[local-name()='name']='HTTPS' and *[local-name()='foo']='bar']/*[local-name()='service-class']"
      );
    });
  });

  describe('#getSegmentXPath()', () => {
    it('should get an XPath from a non-keyed segment', () => {
      expect(getSegmentXPath({ name: 'authority' })).to.equal("*[local-name()='authority']");
    });

    it('should get an XPath from a keyed segment', () => {
      expect(getSegmentXPath({ name: 'session-type', keys: [{ key: 'name', value: 'HTTPS' }] })).to.equal(
        "*[local-name()='session-type'][*[local-name()='name']='HTTPS']"
      );
    });

    it('should get an XPath from a compound keyed segment', () => {
      expect(
        getSegmentXPath({
          keys: [
            { key: 'name', value: 'HTTPS' },
            { key: 'foo', value: 'bar' }
          ],
          name: 'session-type'
        })
      ).to.equal("*[local-name()='session-type'][*[local-name()='name']='HTTPS' and *[local-name()='foo']='bar']");
    });
  });
});
