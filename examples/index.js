const util = require('util');

const fs = require('fs');
const path = require('path');

const { DataModel, DataModelInstance, allow } = require('../dist');

const configModelText = fs.readFileSync(path.join(__dirname, 'consolidatedT128Model.json'), 'utf-8');
const configModel = new DataModel({
  modelElement: JSON.parse(configModelText),
  getRoot: doc => doc.children.find(x => x.name === 'config').children.find(x => x.name === 'authority')
});

const reply = fs.readFileSync(path.join(__dirname, 'small.json'), 'utf-8');
const config = JSON.parse(reply);

const timeStart = process.hrtime();
const instance = new DataModelInstance(configModel, config);
const instanceJSON = instance.toJSON(allow);
const diff = process.hrtime(timeStart);

console.log('JSON serialization took: %ds %dms', diff[0], diff[1] / 1000000)
console.log('Config Model', util.inspect(instanceJSON, { depth: null }));

const statsModelText = fs.readFileSync(path.join(__dirname, 'consolidatedStatsModel.json'), 'utf-8');
const statsModelElement = JSON.parse(statsModelText);

const statsModelOptions = {
  modelElement: statsModelElement,
  getRoot: doc => doc.children.find(x => x.name === 'stats')
};

const statsModel = new DataModel(statsModelOptions);

console.log('Stats Model', statsModel);
