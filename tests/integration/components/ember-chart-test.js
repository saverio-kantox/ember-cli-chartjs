import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import ChartTestData from 'dummy/tests/helpers/ember-chart-data';

moduleForComponent('ember-chart', 'Integration | Component | ember chart', {
  integration: true
});

var testData = ChartTestData.create();
// Test Data

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('model', testData.get('pieModelData'));
  this.set('colors', testData.get('pieModelDataColors'));

  this.render(hbs`{{ember-chart type="pie" labelPath="label" dataPath="value" model=model colors=colors}}`);

  assert.equal(this.$().text().trim(), 'Back');
});
