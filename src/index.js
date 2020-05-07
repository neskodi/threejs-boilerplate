import World from "./world";

new World(threeJsOptions);

// proxy
window.animate = callback => {
  window.World.animate(callback);
}
