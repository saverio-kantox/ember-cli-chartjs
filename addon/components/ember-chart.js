/**
 * @module components
 *
 */
import Ember from 'ember';
/* global Chart */

/**
 * `EmberChart`
 *
 */
export default Ember.Component.extend(
{
	tagName: 'div',

	width: 600,
	height: 600,

	setup: Ember.on('didInsertElement', function()
	{
		const context = this.get('element');
		const data    = this.get('data');
		const type    = this.get('type');
		const options = this.get('options');

		const chart = new Chart(context, {
		  type: type,
		  data: data,
		  options: options
		});

		this.set('chart', chart);
		this.addObserver('data', this, this.updateChart);
		this.addObserver('data.[]', this, this.updateChart);
		this.addObserver('options', this, this.updateChart);
	}),

	teardown: Ember.on('willDestroyElement', function()
	{
		this.get('chart').destroy();
		this.removeObserver('data', this, this.updateChart);
		this.removeObserver('data.[]', this, this.updateChart);
	}),

	updateChart()
	{
		var chart = this.get('chart');
		var data = this.get('data');
		chart.config.data = data;
		chart.update();
	}
});
