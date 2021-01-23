/* Important -
When updating go through the following checklist.
Test every command and feature.
Make sure the metadata.json has the correct version number and changes.
Make sure to delete the settings file, and the two data files.
And make sure to download the right version, and upload the right version to GitHub.
*/


// Imports
import PVObject from "PersistentData";
import { Setting, SettingsObject } from "SettingsManager/SettingsManager";


// Settings menu
const settings = new SettingsObject("AtlasStats", [{
        name: "Display Settings",
		settings:[
            new Setting.Toggle("Enable hud", true),
            new Setting.Toggle("Ban rate", true),
            new Setting.Toggle("Ban accuracy", true),
            new Setting.Toggle("Ban streak", true),
            new Setting.Slider("Decimals", 2, 1, 5, 0),
            new Setting.Slider("Text location X", 10, 0, Renderer.screen.getWidth(), 0),
            new Setting.Slider("Text location Y", 10, 0, Renderer.screen.getHeight(), 0)
		],
	},
]).setCommand("ats").setSize(300, 135);
Setting.register(settings);


// Persistant data for statistics carry-over
var superolddata = new PVObject("AtlasStats", {
    verdict: 0,
    ban: 0
});

var olddata = new PVObject("AtlasStats", {
    verdict: superolddata.verdict,
    ban: superolddata.ban,
    hack: superolddata.ban,
    legit: superolddata.verdict - superolddata.ban
}, ".olddata.json")

var data = new PVObject("AtlasStats", {
    verdict: olddata.verdict,
    ban: olddata.ban,
    hack: olddata.ban,
    legit: olddata.verdict - olddata.ban,
    streak: 0
}, ".newdata.json")


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
}).setCriteria("&8+&r&31,500 &r&7Hypixel Experience (Positive Atlas Verdict)&r");


// Rendering of the text
register("renderOverlay", myRenderOverlay);
function myRenderOverlay() {
    if (settings.getSetting("Display Settings", "Enable hud")) {

        // Variables for location and rates / accuracy
        var x = Number(settings.getSetting("Display Settings", "Text location X"));
        var y = Number(settings.getSetting("Display Settings", "Text location Y"));
        var banRate = ((data.ban / data.verdict) * 100).toFixed(settings.getSetting("Display Settings", "Decimals"));
        var banAccuracy = ((data.ban / data.hack) * 100).toFixed(settings.getSetting("Display Settings", "Decimals"));
        var bRate = settings.getSetting("Display Settings", "Ban rate");
        var bAccuracy = settings.getSetting("Display Settings", "Ban accuracy");
        var bStreak = settings.getSetting("Display Settings", "Ban streak");
        var dAccuracy;
        var dStreak;


        // Distance
        if (bRate && bAccuracy) {
            dAccuracy = 40;
            dStreak = 50;
        }
        else if (!bRate && bAccuracy || bRate && !bAccuracy) {
            dAccuracy = 30;
            dStreak = 40;
        }
        else if (!bRate && !bAccuracy) {
            dStreak = 30;
        }


        // Use of Text function
        var title = new Text("Statistics for Hypixel Atlas", x, y).setColor(Renderer.GOLD);
        var verdictRender = new Text("Verdicts: " + data.verdict, x, y + 10);
        var banRender = new Text("Bans: " + data.ban, x, y + 20);


        // Drawing the text functions on screen
        title.draw();
        verdictRender.draw();
        banRender.draw();


        // Takes the percentage of bans
        if (bRate) {
            var banPercent = new Text(
                "Ban rate: " + banRate + "%", x, y + 30);
            banPercent.draw();
        }


        // Takes the ban accuracy
        if (bAccuracy) {
            var banAPercent = new Text(
                "Ban accuracy: " + banAccuracy + "%", x, y + dAccuracy);

                banAPercent.draw();
        }


        // Takes the ban streak
        if (bStreak) {
            var banStreak = new Text(
                "Hacking streak: " + data.streak, x, y + dStreak);

                banStreak.draw();
        }
    }
}


// Gui check for Positive or negative verdicts
var guiClickTrigger = register("GuiMouseClick", clickFunction);

function clickFunction(mouseX, mouseY, mouseButton, guiName, event) {
    try {

        // Gets clicked gui slot
        var inventory = Player.getOpenedInventory();
        var inventoryName = inventory.getName();

        var myGui = Client.currentGui.get();
        var slotHash = myGui.getSlotUnderMouse();

        if (slotHash !== null) {
            var slotInt = slotHash.field_75222_d;
        }

        // Adds to hack or legit variable if Verdict is made
        if (inventoryName == "Atlas Verdict - Hacking") {
            if (slotInt == 32) {
                setTimeout(function(){
                    data.hack++;
                    data.streak++;
                }, 1000);
            }
            else if (slotInt == 30) {
                setTimeout(function(){
                    data.legit++;
                    data.streak = 0;
                }, 1000);
            }
            else {
                return;
            }
        }
    }
    catch(e) {
        return;
    }
    
}


// Commands
register("command", function(arg) {
    if (arg) {
        switch (arg.toLowerCase()) {
            case "help":
                ChatLib.chat("&3&l| ---------------------------------------------");
                ChatLib.chat("&3&l| /atl help -");
                ChatLib.chat("&a| Shows this command.");
                ChatLib.chat("&3&l| /ats -");
                ChatLib.chat("&aOpens the settings menu.");
                ChatLib.chat("&3&l| /atl verdicts -");
                ChatLib.chat("&a| Shows the number of verdicts you have.");
                ChatLib.chat("&3&l| /atl bans -");
                ChatLib.chat("&a| Shows the number of bans you have.");
                ChatLib.chat("&3&l| /atl evident -");
                ChatLib.chat("&a| Shows this number of evident hacking reports you have.");
                ChatLib.chat("&3&l| /atl insufficient -");
                ChatLib.chat("&a| Shows the number of insufficient evidence reports.");
                ChatLib.chat("&3&l| ---------------------------------------------");
                break;
            case "verdicts":
                ChatLib.chat("&aYou have " + data.verdict + " verdicts!");
                break;
            case "bans":
                ChatLib.chat("&aYou have " + data.ban + " bans!");
                break;
            case "evident":
                ChatLib.chat("&aYou have " + data.hack + " evident hacking reports!");
                break;
            case "insufficient":
                ChatLib.chat("&aYou have " + data.legit + " insufficient evidence report!");
                break;
        }
    }
}).setTabCompletions(["help","settings","verdicts","bans","evident","insufficient"]).setName("atl");