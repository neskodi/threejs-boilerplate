import World from "./world";

new World(threeJsOptions);

// proxy functions
window.animate = callback => {
  window.World.animate(callback);
}

window.render = callback => {
  window.World.render(callback);
}
