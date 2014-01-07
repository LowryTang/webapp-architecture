// Note: tahe mixins support has some method will depends on controller.
// so we only can use it in controllers.
enyo.setPath("Master.controllers.DockSupport", {
	name: "Master.controllers.DockSupport",

	// shared view kind name.
	_dockKindViewName: "shared.DockCategories",
	/**
	 * Get all categories
	 * @param inEvent must contain two parameters @viewAction, @viewkindName.
	 * 
	 */
	getAllCategories: function (extraData) {
		var apiCategories = new Master.models.apipool.Categories();
		// view data.
		var viewData = {
			action: "showUICategories",
			data: extraData
		}
		apiCategories.getApiCategories(enyo.bindSafely(this, "showApiCategories", viewData));
		// binding view to left dock
		this.bindingViewToDock(this._dockKindViewName, null, null);
	},
	// the callback function of getAllCategories().
	showApiCategories: function (viewData, viewModel) {
		this.zLog("response: viewModel: ", viewModel,"viewData:", viewData);
		// show categories view kind.
		var dockViewKind = this._dockKindViewName; //Master.views.shared.DockCategories
		// notify view to update ui interface.
		this.notifyView(dockViewKind, viewModel, viewData);
	}
});