/*
	Author: Luca Naterop
	Copyright 2014 by Luca Naterop
*/

function get(id){	// shrinks often-used function
	return document.getElementById(id);
}

function log(msg){	// needs firebug installed in browser. Logs string argument in js console. 
	console.log(msg);
}

if (typeof Object.create !== 'function') {
	// simplyfies prototyping. To create child from parent use
	// var child = Object.create(parent)
	Object.create = function (o) {
		var F = function () {};
		F.prototype = o;
		return new F();
	};
}


function dom(name,attributes){
	// How to use:
	// var link = dom("A", {href: "http://www.google.com"}, "link")
	// var newParagraph = dom("P", null, "A paragraph with a ", link, " inside of it.");
	// document.body.appendChild(newParagraph);

	// As you can see, if you pass a dom as third or higher argument, it will be child of the first dom.
	// For more examples, see sourcecode of www.freedivetrainer.com
	var node = document.createElement(name);
	if(attributes){
		forEachIn(attributes, function(name, value){
			setNodeAttribute(node, name, value);
		});
	}
	for(var i=2; i<arguments.length; i++){
		var child = arguments[i];
		if(typeof child == "string")
			child = document.createTextNode(child);
		node.appendChild(child);
	}
	return node;
}

function remove(id){	// removes a dom with specified id.
	get(id).remove();
}

function removeByClass(className){	// removes all doms with specified class name.
	document.getElementsByClassName(className).remove();
}



// Helper functions -------------------------------------------------------------------------------------------------------
function forEachIn(object, action){
	for(var property in object){
		if(object.hasOwnProperty(property))
			action(property,object[property]);
	}
}

function setNodeAttribute(node, attribute, value){
	if(attribute == "class")
		node.className = value;
	else if(attribute == "checked")
		node.defaultChecked = value;
	else if(attribute == "for")
		node.htmlFor = value;
	else if(attribute == "style")
		node.style.cssText = value;
	else
		node.setAttribute(attribute, value);
}


Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};