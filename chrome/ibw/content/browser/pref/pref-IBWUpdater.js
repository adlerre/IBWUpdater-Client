var application = Components.classes["@oclcpica.nl/kitabapplication;1"].getService(Components.interfaces.IApplication);

var _elementIDs = [ "IBWUpdater" ];
var updaterData = [];
var gPrefWindow = null;
var idWindow;

var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var iMode = Components.interfaces.nsISupportsString;

function Startup() {
	idWindow = "pref-IBWUpdater";
	try {
		gPrefWindow = window.parent.hPrefWindow;
	} catch (e) {
		alert("FAIL[pref-IBWUpdater.js]: could not establish link to parent\nEXEPTION: " + e);
	}
	gPrefWindow.registerOKCallbackFunc(onOK);
	getUpdateSourceLocation();

	return true;
}

function onOK() {
	if (idWindow != "pref-IBWUpdater")
		return;

	try {
		var dataObject = parent.hPrefWindow.wsm.dataManager.pageData["chrome://ibw/content/browser/pref/pref-IBWUpdater.xul"].userData;
		updaterData = dataObject.updaterData;

		if ("dataEls" in updaterData) {
			var uRLUpdateSourceLocation = updaterData.dataEls.uRLUpdateSourceLocation;

			try {
				gPrefWindow.pref.SetUnicharPref("IBWUpdater.url", uRLUpdateSourceLocation);
			} catch (e) {
				alert("FAIL[pref-IBWUpdater.js]: cannot write general preferences to disk\nEXEPTION: " + e);
			}
		} else {
			alert("FAIL[pref-IBWUpdater.js]: OK handler: no dataEls in updaterData");
		}
	} catch (e) {
		alert("FAIL[pref-IBWUpdater.js]: OK handler: no dataEls in screenObjectData");
	}
}

function onCancel() {
	return true;
}

function GetFields() {
	try {
		var dataObject = {};

		// save data in the parent window
		dataObject.updaterData = updaterData;
		return dataObject;
	} catch (e) {
		alert("FAIL: cannot retrieve data for file locations\nEXEPTION: " + e);
	}
}

function SetFields(aDataObject) {
	updaterData = "updaterData" in aDataObject ? aDataObject.updaterData : updaterData;

	if (!("dataEls" in updaterData)) {
		updaterData = fetchFields(updaterData);
	}
}

function fetchFields(aDataObject) {
	var uRLUpdateSourceLocation = null;

	try {
		uRLUpdateSourceLocation = pref.getComplexValue("IBWUpdater.url", iMode).data;
	} catch (e) {
		// set default value
		uRLUpdateSourceLocation = "http://service.bibliothek.tu-ilmenau.de/ibwupd/";
	}

	aDataObject.dataEls = new Object;
	aDataObject.dataEls.uRLUpdateSourceLocation = uRLUpdateSourceLocation;

	return aDataObject;

}

function getUpdateSourceLocation() {
	document.getElementById("idUpdateSourceLocation").value = updaterData.dataEls.uRLUpdateSourceLocation;
}

function setUpdateSourceLocation(value) {
	gPrefWindow.pref.SetUnicharPref("IBWUpdater.url", value);
}