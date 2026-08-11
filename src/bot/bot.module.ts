import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { UpdateBot } from "./bot.update";
import { AuthModule } from "src/modules/auth/auth.module";
import { BotService } from "./bot.service";

@Module({
    imports: [
        TelegrafModule.forRootAsync({
            useFactory: () => ({
                token: process.env.BOT_TOKEN as string
            })
        }), AuthModule
    ],
    providers: [UpdateBot, BotService]
})
export class BotModule { }