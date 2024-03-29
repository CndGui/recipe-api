import { Module } from "@nestjs/common";
import { RecipeController } from "./recipe.controller";
import { RecipeService } from "./recipe.service";
import { PrismaService } from "../database/prisma.service";

@Module({
    controllers: [RecipeController],
    providers: [RecipeService, PrismaService]
})

export class RecipeModule {}