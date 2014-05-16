/*
	Author: Luca Naterop
*/

function get(id){
	return document.getElementById(id);
}

function log(msg){
	console.log(msg);
}

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

// How to use functino dom(name, attributes):
/*
var link = dom("A", {href: "http://www.google.com"}, "link")
var newParagraph = dom("P", null, "A paragraph with a ", link, " inside of it.");
document.body.appendChild(newParagraph);

As you can see, if you pass a dom as third or higher argument, it will be child of the first dom.
*/

function dom(name,attributes){
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


Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function remove(id){
	//removes the dom having the id "id"
	get(id).remove();
}

function removeByClass(className){
	//removes multiple doms having class "class"
	document.getElementsByClassName(className).remove();
}


function message(message){
	bootbox.alert(message, function() {
	});

}
