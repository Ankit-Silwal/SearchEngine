import SearchEngine from "../core/searchEngine.js";
const engine = new SearchEngine();

engine.addDocument(1, "Apple is red");
engine.addDocument(2, "Apple apple tasty");

console.log(engine.getState());

console.log(engine.search("apple"));       // [2,1]
console.log(engine.search("apple red"));   // [1]
console.log(engine.search("tasty"));       // [2]
console.log(engine.search("banana"));      // []