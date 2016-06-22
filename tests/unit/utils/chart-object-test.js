import chartObject from 'dummy/utils/chart-object';
import { module, test } from 'qunit';

module('Unit | Utility | chart object');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = chartObject.create({
	  model: [],
	  colors: ['#555', '#444'],
	  labelPath: 'test',
	  dataPath: 'test'
  });

  assert.ok(result);
});
