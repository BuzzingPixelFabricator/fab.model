/**
 * Fab Model
 *
 * @package FAB.model
 * @author TJ Draper <tj@buzzingpixel.com>
 * @version 1.0.0
 */

(function(F) {
	'use strict';

	// A place to store GUIDs
	var guids = [];

	// Create GUID
	var guid = function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	};

	/**
	 * Make a model constructor
	 *
	 * @param {Object} attrs
	 */
	var createModelConstructor = function(attrs) {
		// Set a variable for the constructor
		var constructor;

		// Make sure attrs is an object
		if (typeof attrs !== 'object') {
			attrs = {};
		}

		// Define the constructor
		constructor = function(initialValues) {
			// Set a local variable for this
			var thisObj = this;

			// Set GUID
			thisObj.guid = guid();

			// Push the GUID
			guids.push(thisObj.guid);

			// Set up properties
			thisObj.properties = {};

			// Set up property types
			thisObj.propertyTypes = attrs;

			// Set up change events
			thisObj.changeEvents = {};

			// Loop through property types and set change events objects
			for (var prop in thisObj.propertyTypes) {
				if (thisObj.propertyTypes.hasOwnProperty(prop)) {
					thisObj.changeEvents[prop] = {};
				}
			}

			// Set any initial values
			for (var i in initialValues) {
				if (initialValues.hasOwnProperty(i)) {
					if (thisObj.propertyTypes[i] !== undefined) {
						thisObj.properties[i] = initialValues[i];
					}
				}
			}
		};

		// Set prototype methods
		constructor.prototype = {
			get: function(name) {
				if (this.properties[name]) {
					if (this.propertyTypes[name] === 'int') {
						return parseInt(this.properties[name]);
					} else if (this.propertyTypes[name] === 'float') {
						return parseFloat(this.properties[name]);
					} else if (this.propertyTypes[name] === 'string') {
						return String(this.properties[name]);
					} else if (this.propertyTypes[name] === 'bool') {
						if (this.properties[name] === true) {
							return true;
						} else {
							return false;
						}
					} else if (this.propertyTypes[name] === 'array') {
						if (this.properties[name].constructor === Array) {
							return this.properties[name];
						} else {
							return [];
						}
					} else if (this.propertyTypes[name] === 'object') {
						if (this.properties[name].constructor === Object) {
							return this.properties[name];
						} else {
							return {};
						}
					} else {
						return null;
					}
				} else {
					if (
						this.propertyTypes[name] === 'int' ||
						this.propertyTypes[name] === 'float'
					) {
						return 0;
					} else if (this.propertyTypes[name] === 'string') {
						return '';
					} else if (this.propertyTypes[name] === 'bool') {
						return false;
					} else if (this.propertyTypes[name] === 'array') {
						return [];
					} else if (this.propertyTypes[name] === 'object') {
						return {};
					} else {
						return null;
					}
				}
			},
			set: function(name, val) {
				var changed = false;
				var oldVal = this.properties[name];
				var args;

				if (this.propertyTypes[name] === 'int') {
					this.properties[name] = parseInt(val);
					changed = true;
				} else if (this.propertyTypes[name] === 'float') {
					this.properties[name] = parseFloat(val);
					changed = true;
				} else if (this.propertyTypes[name] === 'string') {
					this.properties[name] = String(val);
					changed = true;
				} else if (this.propertyTypes[name] === 'bool') {
					if (val === true || val === 'true' || val === 'yes' || val === 'y') {
						this.properties[name] = true;
					} else {
						this.properties[name] = false;
					}
					changed = true;
				} else if (this.propertyTypes[name] === 'array') {
					if (val.constructor === Array) {
						this.properties[name] = val;
						changed = true;
					}
				} else if (this.propertyTypes[name] === 'object') {
					if (val.constructor === Object) {
						this.properties[name] = val;
						changed = true;
					}
				}

				if (! changed || oldVal === this.properties[name] || this.changeEvents[name] === undefined) {
					return;
				}

				args = [
					this.properties[name],
					oldVal
				];

				for (var i in this.changeEvents[name]) {
					this.changeEvents[name][i].forEach(function(callback) {
						callback.apply(callback, args);
					});
				}
			},
			onChange: function(name, callback) {
				var key = name.split('.');

				if (this.propertyTypes[key[0]] !== undefined) {
					if (key[1] === undefined) {
						if (this.changeEvents[key[0]].noNameSpace === undefined) {
							this.changeEvents[key[0]].noNameSpace = [];
						}

						this.changeEvents[key[0]].noNameSpace.push(callback);
					} else {
						if (this.changeEvents[key[0]][key[1]] === undefined) {
							this.changeEvents[key[0]][key[1]] = [];
						}

						this.changeEvents[key[0]][key[1]].push(callback);
					}
				}
			},
			offChange: function(name) {
				var key = name.split('.');

				if (key[1] === undefined) {
					this.changeEvents[key[0]] = {};
				} else {
					delete this.changeEvents[key[0]][key[1]];
				}
			}
		};

		// Return the constructor
		return constructor;
	};

	/**
	 * Model API
	 */
	F.model = {
		/**
		 * Make a model constructor
		 */
		make: function() {
			return createModelConstructor.apply(
				createModelConstructor,
				arguments
			);
		},

		/**
		 * Validate GUID
		 *
		 * @param {String} guid
		 */
		validateGuid: function(guid) {
			return guids.indexOf(guid) > -1;
		}
	};
})(window.FAB);
