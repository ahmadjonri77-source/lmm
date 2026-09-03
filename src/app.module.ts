import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SeederModule } from './core/seed/seeder.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MentorModule } from './modules/mentor/mentor.module';
import { CategoryModule } from './courses/category/category.module';
import { CourseModule } from './courses/course/course.module';
import { SectionModule } from './courses/section/section.module';
import { LessonModule } from './courses/lesson/lesson.module';
import { HomeworkModule } from './courses/homework/homework.module';
import { BotModule } from './bot/bot.module';
import { StudentsModule } from './modules/students/students.module';
import { RedisModule } from './modules/redis/redis.module';
import { AssistendModule } from './modules/assistend/assistend.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    JwtModule.register({
      secret:process.env.SECRET_KEY,
      global:true
    }),
    RedisModule,
    PrismaModule,
    SeederModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    AssistendModule,
    MentorModule,
    CategoryModule,
    CourseModule,
    SectionModule,
    LessonModule,
    HomeworkModule,
    BotModule,
  ],
})
export class AppModule {}
