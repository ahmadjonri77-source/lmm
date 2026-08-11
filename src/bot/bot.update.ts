import { randomInt } from "crypto";
import { Ctx, On, Start, Update } from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { BotService } from "./bot.service";

@Update()
export class UpdateBot {
    constructor(private readonly botService:BotService){}

    @Start()
    gethello(@Ctx() ctx: Context) {
        ctx.reply("Assalomu Aleykum Hurmatli Mizoj😊\nTelefon raqamizgizni jonating va tasdiqlash kodingizni oling✅", Markup.keyboard([
            [
                Markup.button.contactRequest("Telefon raqamni yuborish")
            ]
        ])
            .oneTime()
            .resize())
    }
    @On("text")
    onText(@Ctx() ctx: Context) {
        ctx.reply("❌ Kechirasiz, raqamni qo'lda yozib yuborish mumkin emas.\nIltimos, pastdagi **'📱 Telefon raqamni yuborish'** tugmasini bosing!", Markup.keyboard([
            [
                Markup.button.contactRequest("Telefon raqamni yuborish")
            ]
        ])
            .oneTime()
            .resize())

    }
    @On("contact")
    async getContact(@Ctx() ctx: Context) {
        if (!ctx.message || !('contact' in ctx.message)) {
            return;
        }

        const phone = ctx.message.contact.phone_number
        const kod = await this.botService.createOtp(phone)
        ctx.reply(`Sizning tasdiqlash kodingiz: ${kod}\n\nUshbu kodni ro'yxatdan o'tish sahifasiga kiriting. Kod 5 daqiqa davomida faol bo'ladi.`)
    }
}