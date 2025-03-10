import { bot } from "../app";
import { setupUserHandlers } from "./handlers/setupUserHandlers";
import { setupPetHandlers } from "./handlers/setupPetHandlers";

export function setupBotHandlers(): void {	
	setupUserHandlers();
	setupPetHandlers();
	bot.launch();
}
