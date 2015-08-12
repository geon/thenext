'use strict';


var thenext = require('./index.js');
var vows = require('vows');
var assert = require('assert');


function makeUsersPromise () {

	return Promise.resolve([
		'geon',
		'neon',
		'peon'
	].map(function (name, index) {

		return {
			id: index + 1,
			name: name
		};
	}));
}


function asyncUppercase (string) {

	return new Promise(function(resolve, reject) {

		setTimeout(function () {
			resolve(string.toUpperCase());
		}, 0);
	});
}


vows.describe('thenext')
	.addBatch({
		'when sequencing': {
			topic: function () {

				var callback = this.callback;

				var counter = 0;
				function generator (delay) {

					return function (argument) {

						if (argument) {

							throw new Error('Recieved argument.');
						}

						return new Promise(function (resolve, reject) {

							setTimeout(function () {

								resolve(counter++);

							}, delay);
						});
					};
				}

				Promise.resolve([
					generator(100),
					generator(10)
				])
					.then(thenext.sequence)
					.then(function (results) {

						return results.join();
					})
					.then(function (results) {

						callback(null, results);

					}, function (error) {

						callback(error);
					});
			},

			'the sequenced functions should not recieve the result from the last': function (topic) {
				// Throws
			},

			'the functions should run in requence': function (topic) {
				assert.equal(topic, '0,1');
			}
		}
	})
	.run();
















