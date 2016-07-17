/**
 * @module components
 *
 */
import Ember from 'ember';
import layout from '../templates/components/ember-chart';
import ChartObject from '../utils/chart-object';
/* global Chart */

function setDefault(object, key, value)
{
	if(Ember.isNone(Ember.get(object, key)))
	{
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

	colors: Ember.computed(function() {
		return null;
	}),

	layout,

	_page: 0,
	_chartObject: null,

	didInsertElement() {
		this._super(...arguments);

    var chart = this.createChart();

		this.set('chart', chart);

		if(this.get('isModel'))
		{
      var _chartObject = this.get('_chartObject');
			_chartObject.set('__chart', chart);
			this.set('_chartObject', _chartObject);

			this.addObserver('model', this, this.updateChart);
			this.addObserver('model.[]', this, this.updateChart);
			this.addObserver('_page', this, this.updateChart);
			this.addObserver('colors.[]', this, this.updateChart);
		}
		else
		{
			this.addObserver('data', this, this.updateChart);
			this.addObserver('data.[]', this, this.updateChart);
		}
		this.addObserver('options', this, this.redrawChart);
		this.addObserver('type', this, this.redrawChart);
	},

  createChart: function() {
		let _chartObject;
		if(!Ember.isNone(this.get('model')))
		{
			this.set('isModel', true);

			_chartObject = ChartObject.create({
				model: this.get('model'),
				labelPath: this.get('labelPath'),
				dataPath: this.get('dataPath'),
				colors: this.get('colors'),
				otherTitle: this.get('otherText'),
				page: this.get('_page'),
			});
		}
		else
		{
			this.set('isModel', false);

			_chartObject = this.get('data');
		}

    this.set('_chartObject', _chartObject);

		const context = this.$().find('canvas').get(0);
		const type    = this.get('type');
		const options = this.setDefaultOptions(this.get('options'));

		return new Chart(context, {
			type: type,
			data: _chartObject,
			options: options
		});
  },

	willDestroyElement() {
		this._super(...arguments);

		this.get('chart').destroy();
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
    setDefault(options.tooltips, 'bodySpacing', '0');
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

      if(Ember.isEmpty(label))
      {
        if(Ember.isEmpty(value))
        {
          return;
        }
        return value;
      }
      else if(Ember.isEmpty(value))
      {
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
        if(!Ember.isNone(model)) {
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
      if(this.get('model.length') !== data.get('model.length'))
      {
        data.set('model', this.get('model'));
      }

      if(this.get('colors.length') !== data.get('colors.length'))
      {
        data.set('colors', this.get('colors'));
      }

      if(this.get('_page') !== data.get('page'))
      {
        data.set('page', this.get('_page'));
      }
    } else {
      data = this.get('data');
      const chart = this.get('chart');
      chart.config.data = data;
      chart.update();
    }
  },

  buttonDisplay: Ember.computed('showBackButton', function() {
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
