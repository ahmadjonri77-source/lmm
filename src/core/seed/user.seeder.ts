import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import * as argon from "argon2"
@Injectable()
 export class UserSeeder implements OnModuleInit{
    constructor(private readonly prisma : PrismaService ){}
    
    async onModuleInit() {
        const existUser = await this.prisma.user.findUnique({
            where:{
                phone:"+998993736777"
            }
        })
        if(existUser){
            return Logger.log("Superadmin already exists")
        }

        await this.prisma.user.create({
            data:{
                full_name:"Ahmadjon Rikhsiboyev",
                phone:"+998993736777",
                password: await argon.hash(process.env.PASSWORD as string),
                role:"SUPERADMIN"
            }
        })
        Logger.log("✅ SUPERADMIN CREATED")
    }

 }