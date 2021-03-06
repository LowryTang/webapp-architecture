/**
 * This is master model. Note one model only one api request.
 * The same api  "POST/PUT", "GET" , "DELETE"
 * @class Master.Model
 * @extends {enyo.Model}
 */
enyo.kind({
	name: "Master.Model",
	kind: "enyo.Model",
	mixins:[
		"Master.ClassSupport",
		"Master.CommonDTOSupport",
		// provider basic methods infrastures for model, collection.
		"Master.ModelSupport"
	],
	constructed: enyo.inherit(function(sup) {
		return function () {
			sup.apply(this, arguments);
			// we must set urlRoot in constructed or contructor need to wait Master.config is ready
			this.urlRoot = Master.config.urlRoot;
			// ajax cache bust.
			this._defaultApiOpts.cacheBust = Master.config.cacheBust;
			this._setupStoreSource();
		};
	})
});