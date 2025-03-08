import {app, bot} from './app';
import { setupBotHandlers } from './bot/bot';
import {config} from "./config/env";
const port = config.port;

const start = async () => {
    try{
        await app.listen({port});
        await setupBotHandlers();
        console.log(`Server running on PORT ${port}`);
    } catch (error){
        console.error(error);
        process.exit(1);
    }
};

start();