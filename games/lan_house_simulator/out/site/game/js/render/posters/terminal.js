import { paintCrtScene } from "./crtScene.js?v=0bd19d58dac2";
/** Individually owned procedural artwork for the terminal poster. */
export const terminalPoster = {
    palette: ["#244c40", "#bdd48d", "#fff0c9"],
    title: ["LAN HOUSE"],
    caption: "PRIMEIRAS CONEXÕES",
    paint(c) { paintCrtScene(c, "terminal"); }
};
