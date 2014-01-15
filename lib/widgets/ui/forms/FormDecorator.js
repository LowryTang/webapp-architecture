/**
 * Defined form validation control for all form child field control
 * dependancy control FormField.js, all child control need to inherite widgets.forms.FormField if 
 * it need to uniform validation handler
 * all child form field control must be placed in 
 */
enyo.kind({
	name: "widgets.forms.FormDecorator",
	mixins: [
		"Master.ClassSupport"
	],
	handlers:{
		onFieldValueChanged: "fieldValueChanged"
	},
	components:[
		{name:"client", classes:"form-childs"},
		{classes:"button-wrapper", components: [
			{kind:"Button", action:"first", name:"firstBtn", classes:"first"},
			{kind:"Button", action:"second", name:"secondBtn", classes: "second"}
		]}
	],

	published: {
		// tool button config
		toolButtonConfig: {
			first: {
				content: Master.locale.get("ACTION_SUBMIT", "label"),
				show: true
			},
			second: {
				content: Master.locale.get("ACTION_RESET","label"),
				show: true
			}
		}
	},
	// private used to sae all validate failed controls
	_failedControls: [],

	create:enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			// tool button config.
		    this.toolButtonConfigChanged();
			// supported validators
			this.validateFnMapping = {
				"required": "requiredValidator",
				"email": "emailValidator"
			};
		};
	}),
	// allow us customized button
	toolButtonConfigChanged: function (oldConfig){
		if (oldConfig) {
			oldConfig.first = this.toolButtonConfig.first || oldConfig.first;
			oldConfig.second = this.toolButtonConfig.second || oldConfig.second;
			this.toolButtonConfig = oldConfig;
		}
		var firstBtnConfig = this.toolButtonConfig.first;
		var secondBtnConfig = this.toolButtonConfig.second;

		this.$.firstBtn.setShowing(firstBtnConfig.show);
		this.$.secondBtn.setShowing(secondBtnConfig.show);

		this.$.firstBtn.setContent(firstBtnConfig.content);
		this.$.secondBtn.setContent(secondBtnConfig.content);
	},
	//@protected.
	validate: function ($control, validateData) {
		var validateResult = {};
		// the validation config of current form field control's
		var validation = validateData.validation;
		var value = enyo.trim(validateData.value);
		var allowEmpty = validateData.allowEmpty;

		if (allowEmpty && value == "") {
			validateResult = {
				type: "allowEmpty",
				message: this.getErrorMessage("allowEmpty")
			};
		} else {
			for(var validType in validation) {
				var validator = this[this.validateFnMapping[validType]];
				if (validator) {
					var result = validator(value);
					if (result !== true) {
						// save validate failed control
						this._failedControls.push({
							control: $control,
							validType: validType
						});
						validateResult = {
							type: validType,
							message: this.getErrorMessage(validType)
						};
						break;
					}
				} else {
					this.zError("current validator have not defined!!");
				}
			}
		}
		this.notifyFormFieldControl($control, validateResult);
	},
	//@public
	// exec this logics at the each submit form double check the all field is correct.
	// manual validate all child form control.
	validateAllControls: function () {
		// remove all faield controls.
		this._failedControls.length = 0;
		var $controls = this.getControls();
		for (var i = $controls.length - 1; i >= 0; i--) {
			var $control = $controls[i];
			if ($control.isFormFieldControl) {
				// driving child form control to exec validation (event notify)
				$control.gotoValidation();
			}
		};
		this.zLog("validate failed controls: ", this._failedControls);
		return (this._failedControls.length == 0);
	},
	fieldValueChanged: function (inSender, inEvent){
		var validateData = {
			allowEmpty: inEvent.allowEmpty || true,
			validation: inEvent.validation,
			value: inEvent.value
		};
		this.validate(inSender, validateData);
		this.zLog("validation: ", validateData);
		return true;
	},
	// @protected.
	// notify validate result to source field control.
	notifyFormFieldControl: function ($control, result) {
		$sender = $control || this;
		$sender.waterfall("onValidateResult", result, this);
	},
	//@public submit form.
	submit: function () {
		// goto validate all form field congtrols.
		this.validateAllControls();

	},
	// validation error message
	getErrorMessage: function (validType) {
		return "Now simple return this message";
	},
	//---------private helper validators--------------//
	requiredValidator: function (value){

	},
	emailValidator: function (value) {

	}
});