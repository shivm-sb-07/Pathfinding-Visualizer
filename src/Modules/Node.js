export default function Node(id, nodeType) {
  this.id = id;
  this.nodeType = nodeType;
  this.distance = Infinity;
  this.previousNode = null;
  this.isVisited = false;
  this.weight = 0;
  this.path = null;
  this.direction = null;
  this.storedDirection = null;
  
  this.totalDistance = Infinity;
  this.heuristicDistance = null;
  this.weight = 0;
  this.relatesToObject = false;
  this.overwriteObjectRelation = false;

  this.otherid = id;
  this.otherstatus = status;
  this.otherpreviousNode = null;
  this.otherpath = null;
  this.otherdirection = null;
  this.otherstoredDirection = null;
  this.otherdistance = Infinity;
  this.otherweight = 0;
  this.otherrelatesToObject = false;
  this.otheroverwriteObjectRelation = false;
}
