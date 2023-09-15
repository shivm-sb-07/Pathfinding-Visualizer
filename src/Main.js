import Board from "./Modules/Board.js";
import getDistance from "./Modules/getDistance.js";
import Node from "./Modules/Node.js";
import weightedSearchAlgorithm from "./Modules/Algorithms/Dijkstra.js";
import recursiveDivisionMaze from "./Modules/Maze/recursiveMaze.js";
import mazeGenerationAnimations from "./Modules/animation/mazeGenerationAnimation.js";
import bidirectional from "./Modules/Algorithms/bidirectional.js";
import launchAnimations from "./Modules/animation/launchAnimation.js";
import unweightedSearchAlgorithm from "./Modules/Algorithms/unweightedSearchAlgorithm.js";

let height = Math.floor(document.documentElement.clientHeight / 50);
let width = Math.floor(document.documentElement.clientWidth / 40);
let board = new Board(height, width);
board.initialize();
let success = "";

document.getElementById("startButtonDijkstra").onclick = function () {

  board.currentAlgorithm = "dijkstra";
  board.currentHeuristic = "";

  if (board.currentAlgorithm === "dijkstra") {
    if (!board.numberOfObjects) {
      console.log("hello");
      success = weightedSearchAlgorithm(board.nodes, board.start, board.target, board.nodesToAnimate, board.nodeArray, board.currentAlgorithm, board.currentHeuristic, board);
      launchAnimations(board, success, "weighted");
    }
    else {
      board.isObject = true;
      success = weightedSearchAlgorithm(board.nodes, board.start, board.object, board.objectNodesToAnimate, board.nodeArray, board.currentAlgorithm, board.currentHeuristic);
      launchAnimations(board, success, "weighted", "object", board.currentAlgorithm, board.currentHeuristic);
    }
  }

};

document.getElementById("startButtonBidirectional").onclick = function () {
  board.currentAlgorithm = "bidirectional";
  board.currentHeuristic = "manhattanDistance";
  if (board.currentAlgorithm === "bidirectional") {
    success = bidirectional(board.nodes, board.start, board.target, board.nodesToAnimate, board.nodeArray, board.currentAlgorithm, board.currentHeuristic, board);
    launchAnimations(board, success, "weighted");
  }
};


document.getElementById("startButtonBFS").onclick = function () {

  board.currentAlgorithm = "bfs";
  board.currentHeuristic = "";
  if (!board.numberOfObjects) {
    success = unweightedSearchAlgorithm(board.nodes, board.start, board.target, board.nodesToAnimate, board.nodeArray, "bfs");
    launchAnimations(board, success, "unweighted");
  } else {
    board.isObject = true;
    success = unweightedSearchAlgorithm(board.nodes, board.start, board.object, board.objectNodesToAnimate, board.nodeArray, "bsf");
    launchAnimations(board, success, "unweighted", "object", board.currentAlgorithm);
  }

};

document.getElementById("startButtonDFS").onclick = function () {

  board.currentAlgorithm = "dfs";
  board.currentHeuristic = "";
  if (!board.numberOfObjects) {
    success = unweightedSearchAlgorithm(board.nodes, board.start, board.target, board.nodesToAnimate, board.nodeArray, "dfs");
    launchAnimations(board, success, "unweighted");
  } else {
    board.isObject = true;
    success = unweightedSearchAlgorithm(board.nodes, board.start, board.object, board.objectNodesToAnimate, board.nodeArray, "dfs");
    launchAnimations(board, success, "unweighted", "object", board.currentAlgorithm);
  }

};

document.getElementById("startButtonCreateMazeTwo").onclick = function () {
  clear();

  recursiveDivisionMaze(board, 2, board.height - 3, 2, board.width - 3, "horizontal", false, "wall");
  mazeGenerationAnimations(board);
};

document.getElementById("startButtonCreateMazeThree").onclick = function () {
  clear();

  recursiveDivisionMaze(board, 2, board.height - 3, 2, board.width - 3, "horizontal", false);
  mazeGenerationAnimations(board);

};
document.getElementById("startButtonCreateMazeFour").onclick = function () {
  clear();

  recursiveDivisionMaze(board, 2, board.height - 3, 2, board.width - 3, "vectical", false);
  mazeGenerationAnimations(board);

};
document.getElementById("startButtonCreateMazeOne").onclick = function () {
  clear();


  board.createMazeOne("wall");

};
document.getElementById("startButtonCreateMazeWeights").onclick = function () {
  clear();

  board.createMazeOne("weight");

};
document.getElementById("startStairDemonstration").onclick = function () {
  clear();

  recursiveDivisionMaze(board, 2, board.height - 3, 2, board.width - 3, "vectical", false, "weight");
  mazeGenerationAnimations(board);

};
document.getElementById("startButtonWeightToggle").onclick = function () {
  if (board.drawWall === false) {
    document.getElementById("startButtonWeightToggle").innerHTML = '<a href="#">Add Weight</a></li>';

    board.drawWall = true;
  }
  else {
    document.getElementById("startButtonWeightToggle").innerHTML = '<a href="#">Add Wall</a></li>';

    board.drawWall = false;
  }
};
document.getElementById("startButtonAddObject").onclick = function () {

  if (board.object === null) {
    let newNodeId = `${3}-${12}`;
    board.object = `${newNodeId}`;
    board.numberOfObjects += 1;
    let noe = document.getElementById(newNodeId);
    noe.className = "object";
    board.nodeArray[3][12].nodeType = "object";
  }

};


document.getElementById("startButtonClearBoard").onclick = function () {
  clear();

};


function clear() {
  Object.keys(board.nodes).forEach(id => {
    let currentNode = board.nodes[id];
    // console.log(currentNode);
    let currentHTMLNode = document.getElementById(id);
    if (currentNode.nodeType === "start") {
      currentHTMLNode.className = "start";
      currentNode.nodeType = "start";
    } else if (currentNode.nodeType === "target") {
      currentHTMLNode.className = "target";
      currentNode.nodeType = "target"
    } else {
      currentHTMLNode.className = "unvisited";
      currentNode.nodeType = "unvisited";
    }
    currentNode.previousNode = null;
    currentNode.path = null;
    currentNode.direction = null;
    currentNode.storedDirection = null;
    currentNode.distance = Infinity;
    currentNode.totalDistance = Infinity;
    currentNode.heuristicDistance = null;
    currentNode.weight = 0;
    currentNode.relatesToObject = false;
    currentNode.overwriteObjectRelation = false;
    board.object = null;
  })
}
