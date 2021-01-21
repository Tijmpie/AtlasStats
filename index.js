import PVObject from "PersistentData";
import { Setting, SettingsObject } from "SettingsManager/SettingsManager";

const settings = new SettingsObject("AtlasStats", [{
        name: "Display Settings",
		settings:[
            new Setting.Toggle("Enable hud", true),
            new Setting.Toggle("Ban rate", true),
            new Setting.Slider("Ban rate decimals", 0, 1, 5, 0)
		],
	},
]).setCommand('ats').setSize(250, 60);
Setting.register(settings);

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
    if (settings.getSetting("Display Settings", "Enable hud")) {
        var title = new Text("Statistics for Hypixel Atlas", 10, 10).setColor(Renderer.GOLD);
        var verdictRender = new Text("Verdicts: " + data.verdict, 10, 20);
        var banRender = new Text("Bans: " + data.ban, 10, 30);

        title.draw();
        verdictRender.draw();
        banRender.draw();

        if (settings.getSetting("Display Settings", "Ban rate")) {
            var banRate = new Text("Ban rate: " + ((data.ban / data.verdict) * 100).toFixed(settings.getSetting("Display Settings", "Ban rate decimals")) + "%", 10, 40)
            banRate.draw();
        }
    }
}