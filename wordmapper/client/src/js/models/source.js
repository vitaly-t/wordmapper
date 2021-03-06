var $ = require('jquery');
var sha1 = require('sha1');
var Word = require('./word.js');

var Source = function(options) {
  this.el = options.el;
  this.index = options.index;
  if (!this.el) {
    throw "Invalid Source: required 'el' attribute";
  }
  if (this.index === "" || isNaN(Number(this.index))) {
    throw "Invalid Source: required 'index' attribute must be a valid number";
  }
  this.original = this.el.innerHTML;
  this.normalizedText = this.el.textContent.replace(/\s+/g, ' ').trim();
  this.hash = sha1(this.normalizedText);
  this.nextWordIndex = this.createWordIndexer();
};
Source.fromDOM = function(el, index) {
  return new Source({ el: el.cloneNode(true), index: index });
};
Source.fromHTML = function(html, index) {
  var temp = document.createElement('template');
  temp.innerHTML = html;
  var fragment = temp.content;
  return new Source({ el: fragment, index: index });
};
Source.createWords = function(spans, sources) {
  sourceMap = sources.getSourceIndexMap();
  return spans.map(function(span) {
    return Word.create({
      index: span.dataset.word,
      source: sourceMap[span.dataset.source],
      value: span.textContent
    });
  });
};
Source.prototype.copyElement = function() {
  return this.el.cloneNode(true);
};
Source.prototype.containsSpans = function(el) {
  return $(this.el).find('.wordmapper-word').length > 0;
};
Source.prototype.transform = function() {
  if (this.containsSpans()) { return this; }

  var callback = function(node) {
    this.transformTextNode(this.index, node);
  }.bind(this);

  this.traverse(this.el, callback);

  return this;
};
Source.prototype.traverse = function(node, callback) {
  var children = Array.prototype.slice.call(node.childNodes);
  for(var i = 0; i < children.length; i++) {
    this.traverse(children[i], callback);
  }
  if (node.nodeType == 3) {
    callback(node);
  }
};
Source.prototype.transformTextNode = function(sourceIndex, textNode) {
  var makeSpan = function(word) {
    return this.makeSpan(word, this.nextWordIndex(), sourceIndex);
  }.bind(this);

  var strings = this.splitText(textNode.nodeValue);
  var span = strings.reduce(function(parentSpan, str, index) {
    if(/\s+/.test(str)) {
      parentSpan.appendChild(document.createTextNode(str));
    } else {
      parentSpan.appendChild(makeSpan(str));
    }
    return parentSpan;
  }, document.createElement("span"));

  textNode.parentNode.replaceChild(span, textNode);
};
Source.prototype.splitText = function(text) {
  return text.split(/(\s+)/).filter(function(word) {
    return word.length > 0;
  });
};
Source.prototype.makeSpan = function(word, wordIndex, sourceIndex) {
  var span = document.createElement('span');
  span.className = 'wordmapper-word';
  span.innerHTML = word;
  span.dataset.word = wordIndex;
  span.dataset.source = sourceIndex;
  return span;
};
Source.prototype.createWordIndexer = function() {
  var index = 0;
  return function() {
    return index++;
  };
};
Source.prototype.toString = function() {
  return this.hash;
};
Source.prototype.toJSON = function() {
  return {
    "type": "source",
    "data": {
      "hash": this.hash,
      "original": this.original,
      "normalized": this.normalizedText
    }
  };
};
Source.prototype.serialize = function() {
  return JSON.stringify(this.toJSON(), null, '\t');
};

module.exports = Source;
