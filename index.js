var verdict = 0
var ban = 0

register("chat", function(message, event){
    verdict++;
}).setCriteria("Atlas verdict submitted! Thank you :)");

register("chat", function(message, event){
    ban++;
}).setCriteria("+2,000 Hypixel Experience (Positive Atlas Verdict)");

register("renderOverlay", myRenderOverlay);
function myRenderOverlay() {
    var title = new Text("Session statistics for Hypixel Atlas", 10, 10).setColor(Renderer.GOLD);
    var verdictRender = new Text("Verdicts: " + verdict, 10, 20);
    var banRender = new Text("Bans: " + ban, 10, 30);

    title.draw();
    verdictRender.draw();
    banRender.draw();
}