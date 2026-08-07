import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer"
import { UserService } from "./users.service";
import { AuthGuard } from "src/common/guards/jwt-auth.guard";
import { RoleGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorator/role";
import { UserRole } from "@prisma/client";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { UpdateAdminDto } from "./dto/update-admin.dto";


@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @ApiOperation({
        summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
    })
    @Get("admin")
    getAllAdmin() {
        return this.userService.getAllAdmin()
    }


    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @ApiOperation({
        summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
    })
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                full_name: { type: "string" },
                phone: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                file: { format: "binary", type: "string" },
            }
        }
    })
    @Post("admin")
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: "./src/uploads/images",
            filename: (req, file, cb) => {
                const filename = new Date().getTime() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        })
    }))
    createAdmin(
        @Body() payload: CreateAdminDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.userService.createAdmin(payload, file?.filename)
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
    @ApiOperation({
        summary: `${UserRole.SUPERADMIN} ${UserRole.ADMIN}`
    })
    @Patch("admin/:id")
    updateAdmin(
        @Body() payload: UpdateAdminDto,
        @Param("id", ParseIntPipe) id: number
    ) {
        return this.userService.updateAdmin(payload, id)
    }



    @Delete("admin/:id")
    deleteAdmin(@Param("id", ParseIntPipe) id: number) {
        return this.userService.deleteAdmin(id)

    }
}