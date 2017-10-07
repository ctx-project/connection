var l = function(o) {console.log(o); return o;},
		require = require || undefined,
		module = module || {};
		
if(require) var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = CtxConnection;

function CtxConnection(base, user) {
	this.base = base;
	this.user = user;
	this.depth = -1;
}

CtxConnection.prototype.getUrl = function() {
	return (this.base.startsWith('http') ? '' : 'http://') + this.base + '/ctx/' + this.user;	
}

CtxConnection.prototype.hint = function(text, cb) {
	CtxConnection.ajax(this.getUrl() + '/hint/' + encodeURIComponent(text), cb, this);
	return this;
}

CtxConnection.prototype.getQuery = function() {
	return '';	
}

CtxConnection.prototype.getPath = function() {
	return [];	
}

CtxConnection.prototype.sub = function(query) {
	return new CtxContext(this, query);
}

CtxConnection.ajax = function(url, cb, details) {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', url, true);
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4)
			cb(xhr.responseText, details);
	}
	
	xhr.send();
}

function CtxContext(parent, query) {
	this.parent = parent;
	this.depth = parent.depth + 1;
	this.setQuery(query);
}

CtxContext.prototype.setQuery = function(query) {
	this.query = (query || '').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	return this;
}

CtxContext.prototype.getPath = function() {
	var p = this.parent.getPath();
	p.push(this.query);
	return p;
}

CtxContext.prototype.getUrl = function() {
	return this.parent.getUrl();
}

CtxContext.prototype.getQuery = function() {
	return this.parent.getQuery() + ' ' + this.query;
}

CtxContext.prototype.get = function(query, cb) {
	CtxConnection.ajax(this.getUrl() + '/get/' + encodeURIComponent(this.getQuery() + ' ' + query), cb, this);
	return this;
}

CtxContext.prototype.put = function(query, cb) {
	CtxConnection.ajax(this.getUrl() + '/put/' + encodeURIComponent(this.getQuery() + ' ' + query), cb, this);
	return this;
}

CtxContext.prototype.sub = function(query) {
	return new CtxContext(this, query);
}
