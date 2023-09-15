import Node from "./Node.js";
import weightedSearchAlgorithm from "./Algorithms/Dijkstra.js";
import recursiveDivisionMaze from "./Maze/recursiveMaze.js";
import mazeGenerationAnimations from "./animation/mazeGenerationAnimation.js";
import bidirectional from "./Algorithms/bidirectional.js";
import launchAnimations from "./animation/launchAnimation.js";
import getDistance from "./getDistance.js";

var boardElement = document.getElementById("board");

export default function Board(height, width) {
    this.height = height;
    this.width = width;
    this.nodes = {};
    this.nodeArray = [];
    this.mouseDown = false;
    this.pressedNodeType = "normal";
    this.objectNodesToAnimate = [];
    this.shortestPathNodesToAnimate = [];
    this.objectShortestPathNodesToAnimate = [];
    this.previouslySwitchedNodeWeight = 0;
    this.start = null;
    this.target = null;
    this.object = null;
    this.keyDown = false;
    this.algoDone = false;
    this.previouslyPressedNodeStatus = null;
    this.previouslySwitchedNode = null;
    this.drawWall = true;
    this.wallsToAnimate = [];
    this.nodesToAnimate = [];
    this.speed = "fast";
    this.currentAlgorithm = "";
    this.currentHeuristic = null;
    this.numberOfObjects = 0;
    this.isObject = false;
    this.buttonsOn = false;
    this.speed = "fast";


}

Board.prototype.initialize = function () {
    this.getGrid();
    this.addEventListeners();
    
};

Board.prototype.createMazeOne = function(type) {
    Object.keys(this.nodes).forEach(node => {
      let random = Math.random();
      let currentHTMLNode = document.getElementById(node);
      let relevantClassNames = ["start", "target","object"]
      let randomTwo = type === "wall" ? 0.25 : 0.35;
      if (random < randomTwo && !relevantClassNames.includes(currentHTMLNode.className)) {
        if (type === "wall") {
          currentHTMLNode.className = "wall";
          this.nodes[node].nodeType = "wall";
          this.nodes[node].weight = 0;
        } else if (type === "weight") {
          currentHTMLNode.className = "unvisited weight";
          this.nodes[node].nodeType = "unvisited ";
          this.nodes[node].weight = 15;
        }
      }
    });
  };

Board.prototype.getGrid = function () {
    let boardHTML = "";
    for (let r = 0; r < this.height; r++) {
        let boardRowArray = []
        let boardHTMLRow = `<tr id="row ${r}">`;
        for (let c = 0; c < this.width; c++) {
            let newNodeId = `${r}-${c}`,
                newNodeClass,
                newNode;
                
            if (r === Math.floor(this.height / 2) && c === (Math.floor(1.5 *(this.width / 4)))) {
                this.start = `${newNodeId}`;
                newNodeClass = "start";
            }
            else if (r === Math.floor(this.height / 2) && c === (Math.floor(2.5 * (this.width / 4)))) {
                newNodeClass = "target";
                this.target = `${newNodeId}`;

            }
            else {
                newNodeClass = "unvisited";

            }
            
            newNode = new Node(newNodeId, newNodeClass);
            boardRowArray.push(newNode);
            boardHTMLRow += `<td id="${newNodeId}" class="${newNodeClass}"></td>`;
            this.nodes[`${newNodeId}`] = newNode;
        }
        this.nodeArray.push(boardRowArray);
        boardHTML += `${boardHTMLRow}</tr>`;
    }
    boardElement.innerHTML = boardHTML;
}
Board.prototype.getNode = function (id) {
    let coordinates = id.split("-");
    let r = parseInt(coordinates[0]);
    let c = parseInt(coordinates[1]);
    return this.nodeArray[r][c];
};

Board.prototype.addEventListeners = function () {
    let board = this;
    for (let r = 0; r < board.height; r++) {
        for (let c = 0; c < board.width; c++) {
            let currentId = `${r}-${c}`;
            let currentNode = board.getNode(currentId);
            let currentElement = document.getElementById(currentId);
           
            currentElement.addEventListener("dblclick", function(){
                

                if (board.pressedNodeType === "object") {
                    console.log("Hello");
                    let noe = document.getElementById(currentId);
                    noe.className = "unvisited";
                    currentNode.nodeType = "normal";
                    board.numberOfObjects = 0;
                }
            });
            currentElement.onmousedown = (e) => {
                e.preventDefault();
                board.mouseDown = true;
                if (currentNode.nodeType === "start" || currentNode.nodeType === "target" || currentNode.nodeType === "object" ) {
                    board.pressedNodeType = currentNode.nodeType;
                } else {
                    board.pressedNodeType = "normal";
                    board.toggleNormalNodeToWall(currentNode);
                }
            }
            currentElement.onmouseup = () => {
                board.mouseDown = false;
                if (board.pressedNodeType === "target") {
                    board.target = currentId;
                } else if (board.pressedNodeType === "start") {
                    board.start = currentId;
                } else if (board.pressedNodeStatus === "object") {
                    board.object = currentId;
                }
                board.pressedNodeType = "normal";
            }
            currentElement.onmouseenter = () => {
                if (board.mouseDown && board.pressedNodeType !== "normal") {
                    board.changeSpecialNode(currentNode);
                    if (board.pressedNodeType === "target") {
                        board.target = currentId;

                    } else if (board.pressedNodeType === "start") {
                        board.start = currentId;

                    } else if (board.pressedNodeType === "object") {
                        board.object = currentId;
                    }
                } else if (board.mouseDown) {
                    board.toggleNormalNodeToWall(currentNode);
                }
            }
            currentElement.onmouseleave = () => {
                if (board.mouseDown && board.pressedNodeType !== "normal") {
                    board.changeSpecialNode(currentNode);
                }
            }

            
        
        }
    }
};

Board.prototype.changeSpecialNode = function (currentNode) {
    let element = document.getElementById(currentNode.id), previousElement;
    if (this.previouslySwitchedNode) previousElement = document.getElementById(this.previouslySwitchedNode.id);
    if (currentNode.nodeType !== "target" && currentNode.nodeType !== "start" && currentNode.nodeType !== "object") {
        // console.log(currentNode.nodeType);  
      if (this.previouslySwitchedNode) {
            this.previouslySwitchedNode.nodeType = this.previouslyPressedNodeStatus;
            previousElement.className = this.previouslySwitchedNodeWeight === 15 ?
                "unvisited weight" : this.previouslyPressedNodeStatus;
            this.previouslySwitchedNode.weight = this.previouslySwitchedNodeWeight === 15 ?
                15 : 0;
            this.previouslySwitchedNode = null;
            this.previouslySwitchedNodeWeight = currentNode.weight;

            this.previouslyPressedNodeStatus = currentNode.nodeType;
            element.className = this.pressedNodeType;
            currentNode.nodeType = this.pressedNodeType;

            currentNode.weight = 0;
        }
    } else if (currentNode.nodeType !== this.pressedNodeType && !this.algoDone) {
      // console.log(currentNode.nodeType);
        this.previouslySwitchedNode.nodeType = this.pressedNodeType;
        previousElement.className = this.pressedNodeType;
    } else if (currentNode.nodeType === this.pressedNodeType) {
        // console.log(currentNode.nodeType);
        this.previouslySwitchedNode = currentNode;
        element.className = this.previouslyPressedNodeStatus;
        currentNode.nodeType = this.previouslyPressedNodeStatus;
    }
};

Board.prototype.toggleNormalNodeToWall = function (currentNode) {
    let board = this;
    let element = document.getElementById(currentNode.id);
    let relevantStatuses = ["start", "target","object"];

    if (!relevantStatuses.includes(currentNode.nodeType)) {
        if (board.drawWall) {
            element.className = currentNode.nodeType !== "wall" ?
                "wall" : "unvisited";
            currentNode.nodeType = element.className !== "wall" ?
                "unvisited" : "wall";
            currentNode.weight = 0;
        }
        else {
            element.className = currentNode.weight !== 15 ?
                "unvisited weight" : "unvisited";
            currentNode.weight = element.className !== "unvisited weight" ?
                0 : 15;     
        }
    }
};

Board.prototype.reset = function(objectNotTransparent) {
    this.nodes[this.start].nodeType = "start";
    document.getElementById(this.start).className = "startTransparent";
    this.nodes[this.target].nodeType = "target";
    if (this.object) {
      this.nodes[this.object].nodeType = "object";
      if (objectNotTransparent) {
        document.getElementById(this.object).className = "visitedObjectNode";
      } else {
        // document.getElementById(this.object).className = "objectTransparent";
      }
    }
  };

Board.prototype.drawShortestPathTimeout = function(targetNodeId, startNodeId, type, object) {
    let board = this;
    let currentNode;
    let secondCurrentNode;
    let currentNodesToAnimate;
  
    if (board.currentAlgorithm !== "bidirectional") {
      currentNode = board.nodes[board.nodes[targetNodeId].previousNode];
      if (object) {
        board.objectShortestPathNodesToAnimate.push("object");
        currentNodesToAnimate = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
      } else {
        currentNodesToAnimate = [];
        while (currentNode.id !== startNodeId) {
          currentNodesToAnimate.unshift(currentNode);
          currentNode = board.nodes[currentNode.previousNode];
        }
      }
    } else {
      if (board.middleNode !== board.target && board.middleNode !== board.start) {
        currentNode = board.nodes[board.nodes[board.middleNode].previousNode];
        secondCurrentNode = board.nodes[board.nodes[board.middleNode].otherpreviousNode];
        if (secondCurrentNode.id === board.target) {
          board.nodes[board.target].direction = getDistance(board.nodes[board.middleNode], board.nodes[board.target])[2];
        }
        if (object) {
  
        } else {
          currentNodesToAnimate = [];
          board.nodes[board.middleNode].direction = getDistance(currentNode, board.nodes[board.middleNode])[2];
          while (currentNode.id !== startNodeId) {
            currentNodesToAnimate.unshift(currentNode);
            currentNode = board.nodes[currentNode.previousNode];
          }
          currentNodesToAnimate.push(board.nodes[board.middleNode]);
          while (secondCurrentNode.id !== targetNodeId) {
            if (secondCurrentNode.otherdirection === "left") {
              secondCurrentNode.direction = "right";
            } else if (secondCurrentNode.otherdirection === "right") {
              secondCurrentNode.direction = "left";
            } else if (secondCurrentNode.otherdirection === "up") {
              secondCurrentNode.direction = "down";
            } else if (secondCurrentNode.otherdirection === "down") {
              secondCurrentNode.direction = "up";
            }
            currentNodesToAnimate.push(secondCurrentNode);
            if (secondCurrentNode.otherpreviousNode === targetNodeId) {
              board.nodes[board.target].direction = getDistance(secondCurrentNode, board.nodes[board.target])[2];
            }
            secondCurrentNode = board.nodes[secondCurrentNode.otherpreviousNode]
          }
      }
    } else {
      currentNodesToAnimate = [];
      let target = board.nodes[board.target];
      currentNodesToAnimate.push(board.nodes[target.previousNode], target);
    }
  
  }
timeout(0);

function timeout(index) {
  if (!currentNodesToAnimate.length) currentNodesToAnimate.push(board.nodes[board.start]);
  setTimeout(function () {
    if (index === 0) {
      shortestPathChange(currentNodesToAnimate[index]);
    } else if (index < currentNodesToAnimate.length) {
      shortestPathChange(currentNodesToAnimate[index], currentNodesToAnimate[index - 1]);
    } else if (index === currentNodesToAnimate.length) {
      shortestPathChange(board.nodes[board.target], currentNodesToAnimate[index - 1], "isActualTarget");
    }
    if (index > currentNodesToAnimate.length) {
    //   board.toggleButtons();
      return;
    }
    timeout(index + 1);
  }, 40)
}

function shortestPathChange(currentNode, previousNode, isActualTarget) {
    if (currentNode === "object") {
      let element = document.getElementById(board.object);
      element.className = "objectTransparent";
    } else if (currentNode.id !== board.start) {
      if (currentNode.id !== board.target || currentNode.id === board.target && isActualTarget) {
        let currentHTMLNode = document.getElementById(currentNode.id);
        if (type === "unweighted") {
          currentHTMLNode.className = "shortest-path-unweighted";
        } else {
          let direction;
          if (currentNode.relatesToObject && !currentNode.overwriteObjectRelation && currentNode.id !== board.target) {
            direction = "storedDirection";
            currentNode.overwriteObjectRelation = true;
          } else {
            direction = "direction";
          }
          if (currentNode[direction] === "up") {
            currentHTMLNode.className = "shortest-path-up";
          } else if (currentNode[direction] === "down") {
            
            currentHTMLNode.className = "shortest-path-down";
          } else if (currentNode[direction] === "right") {
            
            currentHTMLNode.className = "shortest-path-right";
          } else if (currentNode[direction] === "left") {
            
            currentHTMLNode.className = "shortest-path-left";
          } else {
            
            currentHTMLNode.className = "shortest-path";
          }
        }
      }
    }
    if (previousNode) {
      if (previousNode !== "object" && previousNode.id !== board.target && previousNode.id !== board.start) {
        let previousHTMLNode = document.getElementById(previousNode.id);
        previousHTMLNode.className = previousNode.weight === 15 ? "shortest-path weight" : "shortest-path";
      }
    } else {
      let element = document.getElementById(board.start);
      element.className = "startTransparent";
    }
  }

};


Board.prototype.addShortestPath = function(targetNodeId, startNodeId, object) {
    let currentNode = this.nodes[this.nodes[targetNodeId].previousNode];
    if (object) {
      while (currentNode.id !== startNodeId) {
        this.objectShortestPathNodesToAnimate.unshift(currentNode);
        currentNode.relatesToObject = true;
        currentNode = this.nodes[currentNode.previousNode];
      }
    } else {
      while (currentNode.id !== startNodeId) {
        this.shortestPathNodesToAnimate.unshift(currentNode);
        currentNode = this.nodes[currentNode.previousNode];
      }
    }
  };
  
  Board.prototype.clearNodeStatuses = function() {
    Object.keys(this.nodes).forEach(id => {
      let currentNode = this.nodes[id];
      currentNode.previousNode = null;
      currentNode.distance = Infinity;
      currentNode.totalDistance = Infinity;
      currentNode.heuristicDistance = null;
      currentNode.storedDirection = currentNode.direction;
      currentNode.direction = null;
      let relevantStatuses = ["wall", "start", "target", "object"];
      if (!relevantStatuses.includes(currentNode.status)) {
        currentNode.status = "unvisited";
      }
    })
  };
