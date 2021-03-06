enyo.kind({
	name: "Master.controllers.ProfileController",
	kind: "Master.Controller",
	mixins:[
		"Master.controllers.DockSupport"
	],
	// api list view
	_contentProfileApiListKindView: "profile.ApiList",
	// api add new view
	_contentProfileApiAddNewKindView: "profile.ApiNew",
	/**
	 * Action method for all paged api list.
	 * @param  {number} page the page index
	 */
	apiList: function (page) {
		this.zLog("list current page: ", page);
		this.showProfileDockMenus({menuKey: "list"});
		this.bindingViewToContent(this._contentProfileApiListKindView, null, null);

		// loading api list.
		var apiList = new Master.models.apipool.ApiList();
		var viewData = {
			action: "showApiListUI",
			data: {page: page || 1}
		};
		if (isNaN(page)) {
			viewData.data.page = 1;
		}
		apiList.getApiList(enyo.bindSafely(this, "showApiListUI", viewData));
	},
	/**
	 * Action methods add new api information
	 */
	addNewApi: function () {
		this.zLog("add new");
		// show profile.
		this.showProfileDockMenus({menuKey: "list"});
		this.bindingViewToContent(this._contentProfileApiAddNewKindView, null, null);
		var viewModel = {
			restInfo: {
				retCode: 1
			}
		};
		this.notifyView(this._contentProfileApiAddNewKindView, viewModel, {
			action:"showAddNewApiUI"
		});
	},
	editApi:function(apiId) {
		this.zLog("apiId: ", apiId);
		this.showProfileDockMenus({menuKey: "list"});
	},
	removeApi: function (apiId) {
		this.zLog("apiId:", apiId);
		this.showProfileDockMenus({menuKey: "list"});
	},

	showApiListUI: function (viewData, viewModel) {
		this.notifyView(this._contentProfileApiListKindView, viewModel, viewData);
	},
	// show profile dock menus.
	showProfileDockMenus: function (data) {
		// hide tabcontrol.
		Master.view.frame.hideSDKPanel();
		//  profile page.
		Master.view.frame.addClass("profile");
		if (!Master.view.frame.hasProfileContentInDock()) {
			this.showProfileMenus(data);
		}
	}
});