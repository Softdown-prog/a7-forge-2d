import { paintCrtScene } from "./crtScene.js?v=88374e228e86";
/** Individually owned procedural artwork for the arcade poster. */
export const arcadePoster = {
    palette: ["#433e68", "#df967b", "#fff0c7"],
    title: ["JOGOS"],
    caption: "MAIS UMA FASE",
    paint(c) { paintCrtScene(c, "arcade"); }
};
