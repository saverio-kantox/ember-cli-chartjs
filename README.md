# Ember Chart
[![npm version](https://badge.fury.io/js/ember-cli-chartjs.svg)](https://badge.fury.io/js/ember-cli-chartjs)
[![Build Status](https://travis-ci.org/busybusy/ember-cli-chartjs.svg?branch=master)](https://travis-ci.org/busybusy/ember-cli-chartjs)
[![Ember Observer Score](https://emberobserver.com/badges/ember-cli-chartjs.svg)](https://emberobserver.com/addons/ember-cli-chartjs)
[![Ember badge][ember-badge]][embadge]

This Ember CLI addon is a simple wrapper for [ChartJS](http://www.chartjs.org/) (v2.1.6). This addon uses Ember-CLI v2.6.2.

### Installation

```
$ ember install ember-cli-chart
```

### Usage

In your handlebars template just do:

```
{{ember-chart type=CHARTTYPE data=CHARTDATA options=CHARTOPTIONS width=CHARTWIDTH height=CHARTHEIGHT}}
```

* CHARTTYPE: String; one of the following -- `line`, `bar`, `radar`, `polarArea`, `pie` or `doughnut`.
* CHARTDATA: Array; refer to the ChartJS documentation
* CHARTOPTIONS: Object; refer to the ChartJS documentation. This is optional.
* CHARTWIDTH: Number; pixel width of the canvas element. Only applies if the chart is NOT responsive.
* CHARTHEIGHT: Number; pixel height of the canvas element. Only applies if the chart is NOT responsive.

#### Example

```
{{ember-chart type='Pie' data=model.chartData width=200 height=200}}
```

[embadge]: http://embadge.io/
[ember-badge]: http://embadge.io/v1/badge.svg?start=2.6.0
