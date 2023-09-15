export default function mazeGenerationAnimations(board) {
    let nodes = board.wallsToAnimate.slice(0);
    let speed = 0;
    function timeout(index) {
      setTimeout(function () {
          if (index === nodes.length){
            board.wallsToAnimate = [];
            // board.toggleButtons();
            return;
          }
          nodes[index].className = board.nodes[nodes[index].id].weight === 15 ? "unvisited weight" : "wall";
          timeout(index + 1);
      },5);
    }
  
    timeout(0);
  };
  
  