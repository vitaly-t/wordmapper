var Word = require('../../../src/js/models/word.js');

var source_fixture = {"hash": "_some_hash_"};
var source_fixture2 = {"hash": "_some_OTHER_hash"};

describe("Word Model", function() {
  it("should be constructed with an index, value, and source", function() {
    var args = {index:1, value:"hello", source:source_fixture};
    var word = new Word(args);
    expect(word.index).toBe(args.index);
    expect(word.value).toBe(args.value);
    expect(word.source.hash).toBe(args.source.hash);
  });
  it("should raise an exception if not constructed properly", function() {
    expect(function() { new Word(); }).toThrow();
    expect(function() { new Word({index:1,value:"hello"}); }).toThrow();
    expect(function() { new Word({value:"hello", source:source_fixture }); }).toThrow();
    expect(function() { new Word({index:1, source:source_fixture }); }).toThrow();
  });
  it("should be able to compare itself to other words", function() {
    var word1 = new Word({index: 1, value: "hello", source:source_fixture});
    var word2 = new Word({index: 1, value: "hello", source:source_fixture});
    var word3 = new Word({index: 2, value: "hello", source:source_fixture});
    var word4 = new Word({index: 1, value: "hello", source:source_fixture2});
    var word5 = new Word({index: 1, value: "goodbye", source:source_fixture});
    expect(word1.isEqual(word2)).toBe(true);
    expect(word1.isEqual(word3)).toBe(false);
    expect(word1.isEqual(word4)).toBe(false);
    expect(word1.isEqual(word5)).toBe(true); // This should never happen in practice: two words with the same index & source, but different value
  });
  it("should return its value when toString() is called", function() {
    var args = {index:1, value: "hello", source:source_fixture};
    var word = new Word(args);
    expect(word.toString()).toBe(args.value);
  });
  it("shoould be able to return itself as JSON", function() {
    var args = {index:1, value: "hello", source:source_fixture};
    var expected_json = {
      "type": "word",
      "data": {
        "index": args.index,
        "value": args.value,
        "source": args.source.hash
      }
    };
    var word = new Word(args);
    var given_json = word.toJSON();
    expect(given_json.type).toBe("word");
    expect(given_json.data).toEqual(expected_json.data);
  });
});