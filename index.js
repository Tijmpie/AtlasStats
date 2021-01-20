import PVObject from "PersistentData";

var data = new PVObject("AtlasStats", {
    verdict: 0,
    ban: 0
});

register("chat", function(message, event){
    data.verdict++;
}).setCriteria("&r&aAtlas verdict submitted! Thank you :)&r");

register("chat", function(message, event){
    data.ban++;
}).setCriteria("&8+&r&32,000 &r&7Hypixel Experience (Positive Atlas Verdict)&r");

register("renderOverlay", myRenderOverlay);
function myRenderOverlay() {
    var title = new Text("Statistics for Hypixel Atlas", 10, 10).setColor(Renderer.GOLD);
    var verdictRender = new Text("Verdicts: " + data.verdict, 10, 20);
    var banRender = new Text("Bans: " + data.ban, 10, 30);

    title.draw();
    verdictRender.draw();
    banRender.draw();
}