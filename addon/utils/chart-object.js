
import Ember from 'ember';

export default Ember.Object.extend(
{
	model: null,
	colors: null,
	labelPath: '',
	dataPath: '',
	otherTitle: 'Other',
	page: 0,

	modelPath: null,
	type: '',

	datasets: null,
	labels: null,

	_init: Ember.on('init', function() {
		this.setup();
	}),

	_buildData: Ember.observer('model.[]', 'colors', 'page', function() {
		this.setup();
		this.get('__chart').update();
	}),

	setup: function() {
		Ember.assert("labelPath must be set to parse the model objects for labels <ember-chart::labelPath>", !Ember.isEmpty(this.get('labelPath')));
		Ember.assert("dataPath must be set to parse the model objects for data values <ember-chart::dataPath>", !Ember.isEmpty(this.get('dataPath')));
		Ember.assert("colors must be set so the chart can render <ember-chart::colors>", !Ember.isEmpty(this.get('colors')));

		const type = this.get('type');
		if (type === 'pie' || type === 'doughnut') {
			this.setPieData();
		} else if (type === 'bar') {
			this.setBarData();
		} else if (type === 'line') {
			this.setLineData();
		}
	},

	setPieData() {
		const _length = Ember.get(this, 'colors.length') - 1;
		const showing = this.get('page') * (_length - 1);
		const labels = Ember.A();
		const datasets = Ember.A();

		this.get('modelPath').forEach(model => {
			const data = Ember.A();
			let otherTotal = 0;
			let hasOther = false;

			if(!Ember.isNone(this.get(model))) {
				this.get(model).slice(showing).forEach((item, index) => {
					if (index < (_length - 1)) {
						const _label = Ember.get(item, this.get('labelPath')) || '';
						if(labels.indexOf(_label) === -1) {
							labels.push(_label);
						}

						// 0.01 is a hack to make all zero charts show up.
						data.push(Ember.get(item, this.get('dataPath')) || 0.01);
					} else {
						hasOther = true;
						otherTotal += Ember.get(item, this.get('dataPath')) || 0;
					}
				});

				if (otherTotal > 0 || hasOther) {
					labels.push(this.get('otherTitle'));
					data.push(otherTotal || 0.01);
				}

				datasets.push(Ember.Object.create({
					data: data,
					backgroundColor: this.get('colors').slice(0, _length),
					hoverBackgroundColor: this.get('colors').slice(_length)
				}));
			}
		});

		this.set('labels', labels);
		this.set('datasets', datasets);
	},

	setBarData() {
		return;
	},

	setLineData() {
		const labels = Ember.A();
		const datasets = Ember.A();
		const colors = this.get('colors') || [];
		const legends = this.get('options.legends') || [];

		Ember.assert('colors: must be an array of strings', Ember.isArray(colors));
		Ember.assert('legends: must be an array of strings', Ember.isArray(legends));

		this.get('modelPath').forEach((model, idx) => {
			console.log(model, idx, colors, legends);
			const data = Ember.A();
			if(!Ember.isNone(this.get(model))) {
				this.get(model).forEach(item => {
					const _label = Ember.get(item, this.get('labelPath')) || '';
					if(labels.indexOf(_label) === -1) {
						labels.push(_label);
					}
					// 0.01 is a hack to make all zero charts show up.
					data.push(Ember.get(item, this.get('dataPath')) || 0.01);
				});
			}

			const _dataset = Ember.Object.create({ data });
			if (!Ember.isNone(this.get('options.line'))) {
				const options = this.get('options.line');
				for (let i in options) {
					if (options.hasOwnProperty(i)) {
						_dataset.set(i, options[i]);
					}
				}
			}

			// set border and label
			_dataset.set('borderColor', colors[idx]);
			_dataset.set('backgroundColor', colors[idx]);
			_dataset.set('label', legends[idx]);

			console.log('dataset', _dataset, idx);
			datasets.push(_dataset);
		});

		this.set('labels', labels);
		this.set('datasets', datasets);
	},


	_dataset: Ember.computed(function() {
		return this.get('datasets').objectAt(0);
	}),

	getModel: function(index) {
		const models = this.get('model');

		if(models && models.objectAt && models.objectAt(index))
		{
			return models.objectAt(index);
		}
		else if(models && models[index])
		{
			return models[index];
		}

		return null;
	}
});
