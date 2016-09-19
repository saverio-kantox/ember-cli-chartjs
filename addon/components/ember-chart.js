/* global Chart */
/**
 * @module components
 *
 */
import Ember from 'ember';
import layout from '../templates/components/ember-chart';
import ChartObject from '../utils/chart-object';

const { isNone, isEmpty, computed, get } = Ember;

/***/

/**
 * Sets a property to a default value if the property is
 * not already set.
 *
 * @private
 * @method setDefault
 * @param {object} object The object to set the value on
 * @param {string} key The key to the value in the object
 * @param {mixed} The default value to set
 */
function setDefault(object, key, value) {
	if(isNone(get(object, key))) {
		Ember.set(object, key, value);
	}
}

/**
 * `EmberChart`
 *
 */
export default Ember.Component.extend({
	model: null,
	labelPath: null,
	dataPath: null,
	backText: "Back",
	otherText: "Other",
	width: 600,
	height: 600,

	isModel: false,

	colors: computed(function() {
		return null;
	}),

	layout,

	_page: 0,
	_chartObject: null,

	/**
	 * Ember init function gets called when the component
	 * has rendered the element to the DOM
	 *
	 * @public
	 * @method didInsertElement
	 */
	didInsertElement() {
		// call the super funtion to handle any parent rendering
		this._super(...arguments);

		// create a chart object
		const chart = this.createChart();

		// save the chart object for later use
		this.set('chart', chart);

		if(this.get('isModel')) {
			// add oberserver methods for the model
			['model', 'model.[]', '_page', 'colors.[]'].forEach((observable) => {
				this.addObserver(observable, this, this.updateChart);
			});
		} else {
			// add observer methods for chart data
			this.addObserver('data', this, this.updateChart);
			this.addObserver('data.[]', this, this.updateChart);
		}

		// add observers for options and type
		this.addObserver('options', this, this.redrawChart);
		this.addObserver('type', this, this.redrawChart);
	},

	/**
	 * Creates a chart object with the type and values
	 * passed in.
	 *
	 * @public
	 * @method createChart
	 * @returns {Chart} chartjs object class
	 */
	createChart() {
		const isModel = !isNone(this.get('model'));
		this.set('isModel', isModel);

		let _chartObject = this.initializeChartDataObject(isModel);

		const context = this.$().find('canvas').get(0),
					type    = this.get('type'),
					options = this.setDefaultOptions(this.get('options'));

		const chart = new Chart(context, {
			type: type,
			data: _chartObject,
			options: options
		});

		// add the chart to the chartObject if
		// this is a model chartObject.
		if(isModel) {
			_chartObject.set('__chart', chart);
		}

		// store the ember model _chartObject
		this.set('_chartObject', _chartObject);

		// return the chartjs class
		return chart;
	},

	/**
	 * Creates a chart data object with the type and values
	 * passed in.
	 *
	 * @public
	 * @method initializeChartDataObject
	 * @returns {ChartObject}
	 */
	initializeChartDataObject(isModel){
    let _chartObject;
    // if and ember model is passed in then
    // setup the chart object to handle the model data
    if(isModel) {
      // create a ChartObject that converts an ember model
      // to a chartjs data structure.
      _chartObject = ChartObject.create({
        model: this.get('model'),
        labelPath: this.get('labelPath'),
        dataPath: this.get('dataPath'),
        colors: this.get('colors'),
        otherTitle: this.get('otherText'),
        page: this.get('_page'),
      });
    } else {
      // set isModel to false and use
      // the chartjs style data array passed in
      _chartObject = this.get('data');
    }

    return _chartObject;
  },

	/**
	 * Ember callback gets called when the component is getting destroyed
	 *
	 * @public
	 * @method willDestroyElement
	 */
	willDestroyElement() {
		this._super(...arguments);

		// destroy the chartjs object class
		this.get('chart').destroy();

		// remove the observers
		this.addObserver('data', this, this.updateChart);
		this.addObserver('data.[]', this, this.updateChart);
		this.removeObserver('model', this, this.updateChart);
		this.removeObserver('model.[]', this, this.updateChart);
		this.removeObserver('_page', this, this.updateChart);
		this.removeObserver('colors.[]', this, this.updateChart);
		this.removeObserver('options', this, this.redrawChart);
		this.removeObserver('type', this, this.redrawChart);
	},

	redrawChart: function() {
		var existingChart = this.get('chart');
		if (existingChart) {
			existingChart.destroy();
		}
		this.set('chart', this.createChart());
	},

	setDefaultOptions(options) {
		const _this = this;

		// set options
		options = options || {};

		// set onClick options
		let oldOnClick = function(){};
		if(options.onClick) {oldOnClick = options.onClick;}

		options.onClick = function() {
			_this.clickAction.apply(_this, arguments);
			oldOnClick.apply(this, arguments);
		};

		// set legend options
		options.legend = options.legend || {};

		setDefault(options.legend, 'display', true);
		setDefault(options.legend, 'position', 'bottom');
		setDefault(options.legend, 'fullWidth', true);

		// set tooltip options
		options.tooltips = options.tooltips || {};

		setDefault(options.tooltips, 'enabled', true);
		setDefault(options.tooltips, 'mode', 'single');
		setDefault(options.tooltips, 'backgroundColor', 'rgba(240,240,240,1)');
		setDefault(options.tooltips, 'titleFontColor', '#444');
		setDefault(options.tooltips, 'bodyFontColor', '#444');
		setDefault(options.tooltips, 'bodySpacing', 0);
		setDefault(options.tooltips, 'bodyFontStyle', 'italic');
		setDefault(options.tooltips, 'footerFontColor', '#444');
		setDefault(options.tooltips, 'xPadding', 10);
		setDefault(options.tooltips, 'yPadding', 15);
		setDefault(options.tooltips, 'caretSize', 10);
		setDefault(options.tooltips, 'cornerRadius', 3);
		setDefault(options.tooltips, 'multiKeybackground', '#999');

		// set tooltip callbacks
		options.tooltips.callbacks = options.tooltips.callbacks || {};

		setDefault(options.tooltips.callbacks, 'label', function(tooltip, data) {
			const label = data.labels[tooltip.index];
			const value = data.datasets[tooltip.datasetIndex].data[tooltip.index];

			if(isEmpty(label)) {
				if(isEmpty(value)) {
					return;
				}
				return value;
			} else if(isEmpty(value)) {
				return label;
			}

			return _this.tooltip(label, value);
		});

		// return options with defaults
		return options;
	},

	clickAction(evt, segment) {
		if(this.get('isModel')) {
			segment = segment[0] || {};
			let segmentModel = segment._model;
			if(segmentModel && segmentModel.label === 'Other') {
				this.set('_page', this.get('_page') + 1);
				this.set('showBackButton', true);
			} else if(segmentModel && segmentModel.label) {
				let index = ((this.get('colors.length') - 2) * this.get('_page')) + segment._index;
				let model = this.get('_chartObject').getModel(index);
				if(!isNone(model)) {
					this.sendAction('onClick', model);
				}
			}
		} else {
			this.sendAction('onClick', evt, segment);
		}
	},

	tooltip(label, value) {
		return label + ': ' + value;
	},

	updateChart() {
		let data;
		if(this.get('isModel')) {
			data = this.get('_chartObject');
			if(this.get('model.length') !== data.get('model.length')) {
				data.set('model', this.get('model'));
			}

			if(this.get('colors.length') !== data.get('colors.length')) {
				data.set('colors', this.get('colors'));
			}

			if(this.get('_page') !== data.get('page')) {
				data.set('page', this.get('_page'));
			}
		} else {
			data = this.get('data');
			const chart = this.get('chart');
			chart.config.data = data;
			chart.update();
		}
	},

	buttonDisplay: computed('showBackButton', function() {
		if(this.get('showBackButton')) {
			return Ember.String.htmlSafe('display:block; position:absolute; top:0; left:0;');
		}

		return Ember.String.htmlSafe('display:none; position:absolute;');
	}),

	actions: {
		backAction() {
			let segments = (this.get('_page') - 1);
			if(segments <= 0) {
				segments = 0;
				this.set('showBackButton', false);
			}

			this.set('_page', segments);
		}
	}
});
