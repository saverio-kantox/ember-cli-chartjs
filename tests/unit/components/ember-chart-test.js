import {
  moduleForComponent,
  test
} from 'ember-qunit';
import ChartTestData from 'dummy/tests/helpers/ember-chart-data';

moduleForComponent('ember-chart', 'EmberChartComponent', {
  unit: true
});

var testData = ChartTestData.create();
// Test Data


test('it can be a pie chart', function(assert) {
  var component = this.subject({
    type: 'pie',
    model: testData.get('pieModelData'),
    labelPath: 'label',
    dataPath: 'value',
    colors: testData.get('pieModelDataColors')
  });

  this.render();
  var chart = component.get('chart');

  assert.equal(chart.config.type, 'pie');
  assert.equal(chart.data.datasets[0].data.length, 3);
});

test('it can be a line chart', function(assert) {
  var component = this.subject({
    type: 'line',
    data: testData.get('lineData')
  });

  this.render();
  var chart = component.get('chart');

  assert.equal(chart.config.type, 'line');
  assert.equal(chart.data.datasets.length, 2);
});

test('it can be a bar chart', function(assert) {
  var component = this.subject({
    type: 'bar',
    data: testData.get('lineData')
  });

  this.render();
  var chart = component.get('chart');

  assert.equal(chart.config.type, 'bar');
  assert.equal(chart.data.datasets.length, 2);
});

test('it can be a Radar chart', function(assert) {
  var component = this.subject({
    type: 'radar',
    data: testData.get('lineData')
  });

  this.render();
  var chart = component.get('chart');

  assert.equal(chart.config.type, 'radar');
  assert.equal(chart.data.datasets.length, 2);
});

test('it can be a Polar Area chart', function(assert) {
  var component = this.subject({
    type: 'polarArea',
    data: testData.get('pieData')
  });

  this.render();
  var chart = component.get('chart');

  assert.equal(chart.config.type, 'polarArea');
  assert.equal(chart.data.datasets[0].data.length, 3);
});

test('it should update pie charts dynamically', function(assert) {
  var component = this.subject({
    type: 'pie',
    data: testData.get('pieData')
  });

  this.render();
  var chart = component.get('chart');
  assert.equal(chart.data.datasets[0].data[0], 300);

  // Update Data
  testData.set('pieValue1', 600);
  component.set('data', testData.get('pieData'));

  chart = component.get('chart');
  assert.equal(chart.data.datasets[0].data[0], 600);
});

test('it should update charts dynamically', function(assert) {
  var component = this.subject({
    type: 'line',
    data: testData.get('lineData')
  });

  this.render();
  var chart = component.get('chart');
  assert.equal(chart.data.datasets[0].data[0], 65);

  // Update Data
  testData.set('lineValue1', 105);
  component.set('data', testData.get('lineData'));

  chart = component.get('chart');
  assert.equal(chart.data.datasets[0].data[0], 105);

  // Update Labels
  testData.set('labelValue1', 'December');
  component.set('data', testData.get('lineData'));

  chart = component.get('chart');
  assert.equal(chart.data.labels[0], 'December');
});

test('it should update chart options dynamically', function(assert) {
  var component = this.subject({
    type: 'bar',
    data: testData.get('lineData')
  });

  this.render();
  var chart = component.get('chart');

  assert.equal(chart.config.type, 'bar');
  assert.equal(chart.data.datasets.length, 2);
  assert.equal(chart.options.responsive, true);
  assert.equal(chart.config.options.responsive, true);

  var options = { responsive: false };
  component.set('options', options);

  chart = component.get('chart');
  assert.equal(chart.options.responsive, false);
  assert.equal(chart.config.options.responsive, false);
});

test('it should rebuild the chart (line -> bar) if the chart type changes', function(assert) {
  var component = this.subject({
    type: 'line',
    data: testData.get('lineData')
  });

  this.render();
  var chart = component.get('chart');
  assert.equal(chart.config.type, 'line');

  //Update Type -- change to bar type
  component.set('type', 'bar');

  chart = component.get('chart');

  assert.equal(chart.config.type, 'bar');
});
