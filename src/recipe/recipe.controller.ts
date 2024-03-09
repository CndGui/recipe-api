import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { RecipeRequestDTO, RecipeResponseDTO, RecipeUpdateDTO } from "./recipe";
import { RecipeService } from "./recipe.service";

@Controller("recipes")
export class RecipeController {
    constructor(private service: RecipeService) {}

    @Get()
    async getAll(): Promise<RecipeResponseDTO[]> {
        return await this.service.getAll()
    }

    @Get(":id")
    async get(@Param("id", ParseIntPipe) id: number): Promise<RecipeResponseDTO> {
        return await this.service.get(id) 
    }

    @Post()
    async create(@Body() data: RecipeRequestDTO): Promise<RecipeResponseDTO> {
        return await this.service.create(data)
    }

    @Put(":id")
    async update(@Param("id", ParseIntPipe) id: number, @Body() data: RecipeUpdateDTO): Promise<RecipeResponseDTO> {
        return await this.service.update(id, data)
    }

    @Delete(":id")
    async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.service.delete(id)
    }
}