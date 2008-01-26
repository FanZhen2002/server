/*******************************************************************************
 * Copyright (c) 2007 Eclipse Foundation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Paul Colton (Aptana)- initial API and implementation
 *    Eclipse Foundation
*******************************************************************************/

YAHOO.versionManager = {
	getAjaxVersions: function(selectedIn){
		var callback = 
		{ 
			start:function(eventType, args){ 
			},
			success: function(o) {
				var domNode = document.getElementById('version-area');
				var response = eval("("+o.responseText+")");
				if(response){
	//				YAHOO.log(o.responseText);
					domNode.innerHTML = "";
					
					for(var i = 0; i < response.length; i++){
						var proj = new version(response[i]);
						domNode.appendChild(proj.createHTML());
						if(response[i]['current']){
							YAHOO.versionManager.updateSelected(proj);
						}
						
						
					}
				}else{
					domNode.innerHTML = "";
				}
				
				YAHOO.filesManager.getAjax();
			},
			failure: function(o) {
				YAHOO.log('failed!');
			} 
		} 
		YAHOO.util.Connect.asyncRequest('GET', "callback/getVersionsforProject.php", callback, null); 
	},

	getSelected: function(){
		return this.selected;
	},
	
	updateSelected: function(selec){
		if(this.selected){
			this.selected.unselect();
		}
		this.selected = selec;
		this.selected.selected();
	}
};

function version(dataIn){
	this.version = dataIn['version'];
	version.superclass.constructor.call();
	this.initSelectable();
}
YAHOO.extend(version,selectable);
version.prototype.isSelected = function(){
 return (this == YAHOO.versionManager.selected);
}


version.prototype.clicked = function(e){
	YAHOO.util.Event.stopEvent(e);
	var callback = 
	{ 
		start:function(eventType, args){ 
		},
		success: function(o) {
			YAHOO.filesManager.getAjax();
		},
		failure: function(o) {
			YAHOO.log('failed!');
		} 
	} 
	var target = YAHOO.util.Event.getTarget(e);
	YAHOO.versionManager.updateSelected(this);
	YAHOO.util.Connect.asyncRequest('POST', "callback/setCurrentProjectVersion.php", callback, "version="+this.version);
}
version.prototype.createHTML = function(){
	this.domElem = document.createElement("li");
	this.domElem.innerHTML = this.version;
	this.addEvents();
	return this.domElem;
}

