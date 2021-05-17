# Yinz JSON ![Node.js CI](https://github.com/128technology/yinz-json/workflows/Node.js%20CI/badge.svg) 

A library for Node.js that can parse YIN ([RFC 6020](https://tools.ietf.org/html/rfc6020)) models and ingest JSON instance data associated with them.  Note that is library is designed to work with consolidated JSON models produced by [YINsolidated](https://github.com/128technology/yinsolidated), it will not work on standard YIN models.

This library aims to accomplish the following:
* Ingest JSON datamodels produced by [YINsolidated](https://github.com/128technology/yinsolidated).
* Allow querying and walking of the ingested models, including support for the types outlined in [RFC 6020](https://tools.ietf.org/html/rfc6020).
* Ingest a JSON instance of data matching the ingested datamodel. This typically comes from a [NETCONF](https://tools.ietf.org/html/rfc6241) response.
* Allow querying of the instance data, including evaluation of when conditions, leaf references, etc.
