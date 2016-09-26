
import Ember from 'ember';

export default Ember.Object.extend(
{
	model: null,
	colors: null,
	labelPath: '',
	dataPath: '',
	otherTitle: 'Other',
	page: 0,

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

		const _length = Ember.get(this, 'colors.length') - 1;
		const showing = this.get('page') * (_length - 1);
		const labels = Ember.A([]);
		const data = Ember.A([]);

		let otherTotal = 0;

		if(!Ember.isNone(this.get('model'))) {
			this.get('model').slice(showing).forEach((item, index) => {
				if(index < (_length - 1))
				{
					labels.push(Ember.get(item, this.get('labelPath')) || '');

					// 0.01 is a hack to make all zero charts show up.
					data.push(Ember.get(item, this.get('dataPath')) || 0.01);
				}
				else
				{
					otherTotal += Ember.get(item, this.get('dataPath')) || 0;
				}
			});
		}

		if(otherTotal > 0)
		{
			labels.push(this.get('otherTitle'));
			data.push(otherTotal);
		}

		this.set('labels', labels);
		this.set('datasets', Ember.A([
			Ember.Object.create({
				data: data,
				backgroundColor: this.get('colors').slice(0, _length),
				hoverBackgroundColor: this.get('colors').slice(_length)
			})
		]));
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
