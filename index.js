// Imports
import PVObject from "PersistentData";
import { Setting, SettingsObject } from "SettingsManager/SettingsManager";


// Settings menu
const settings = new SettingsObject("AtlasStats", [{
        name: "Display Settings",
		settings:[
            new Setting.Toggle("Enable hud", true),
            new Setting.Toggle("Ban rate", true),
            new Setting.Slider("Ban rate decimals", 1, 1, 5, 0),
            new Setting.Slider("Text location X", 10, 0, Renderer.screen.getWidth(), 0),
            new Setting.Slider("Text location Y", 10, 0, Renderer.screen.getHeight(), 0)
		],
	},
]).setCommand('ats').setSize(250, 110);
Setting.register(settings);


// Persistant data for statistics
var data = new PVObject("AtlasStats", {
    verdict: 0,
    ban: 0
});


// Keybinds
const TPsus = new KeyBind("Teleport to suspect", Keyboard.KEY_NONE, "AtlasStats")

register("tick", function(){
    if(TPsus.isPressed()){
        ChatLib.command("tp suspect")
    }
});


// Registration for verdicts and bans
register("chat", function(message, event){
    data.verdict++;
}).setCriteria("&r&aAtlas verdict submitted! Thank you :)&r");

register("chat", function(message, event){
    data.ban++;
}).setCriteria("&8+&r&32,000 &r&7Hypixel Experience (Positive Atlas Verdict)&r");


// Rendering of the text
register("renderOverlay", myRenderOverlay);
function myRenderOverlay() {
    if (settings.getSetting("Display Settings", "Enable hud")) {
        var x = Number(settings.getSetting("Display Settings", "Text location X"));
        var y = Number(settings.getSetting("Display Settings", "Text location Y"));
        var banRate = ((data.ban / data.verdict) * 100).toFixed(settings.getSetting("Display Settings", "Ban rate decimals"))

        var title = new Text("Statistics for Hypixel Atlas", x, y).setColor(Renderer.GOLD);
        var verdictRender = new Text("Verdicts: " + data.verdict, x, y + 10);
        var banRender = new Text("Bans: " + data.ban, x, y + 20);

        title.draw();
        verdictRender.draw();
        banRender.draw();


        // Takes the percentage of bans
        if (settings.getSetting("Display Settings", "Ban rate")) {
            var banPercent = new Text(
                "Ban rate: " + banRate + "%", x, y + 30);

            banPercent.draw();
        }
    }
}