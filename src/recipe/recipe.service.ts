import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RecipeRequestDTO, RecipeResponseDTO, RecipeUpdateDTO } from "./recipe";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class RecipeService {
    constructor(private service: PrismaService) { }

    async getAll(): Promise<RecipeResponseDTO[]> {
        return (await this.service.recipe.findMany({ include: { ingredients: true } })).sort((a, b) => {
            if (a.id > b.id) {
                return 1
            }

            if (a.id < b.id) {
                return -1
            }

            return 0
        })
    }

    async get(id: number): Promise<RecipeResponseDTO> {
        const recipe = await this.service.recipe.findUnique({ where: { id }, include: { ingredients: true } })
        if (recipe == null) {
            throw new HttpException(`The recipe with ID ${id} does not exist!`, HttpStatus.NOT_FOUND)
        }

        return recipe
    }

    async create(data: RecipeRequestDTO): Promise<RecipeResponseDTO> {
        const recipe = await this.service.recipe.create({
            data: {
                name: data.name,
                description: data.description
            }
        })

        for (const ingredientName of data.ingredients) {
            await this.service.ingredient.create({
                data: {
                    name: ingredientName,
                    recipeId: recipe.id
                }
            })
        }

        return await this.service.recipe.findUnique({ where: { id: recipe.id }, include: { ingredients: true } })
    }

    async update(id: number, data: RecipeUpdateDTO): Promise<RecipeResponseDTO> {
        const recipe = await this.service.recipe.findUnique({ where: { id } })
        if (recipe == null) {
            throw new HttpException(`The recipe with ID ${id} does not exist!`, HttpStatus.NOT_FOUND)
        }

        await this.service.recipe.update({
            where: { id },
            data: {
                name: data.name ? data.name : recipe.name,
                description: data.description ? data.description : recipe.description,
            }
        })

        if (data.ingredients?.length > 0) {
            await this.service.ingredient.deleteMany({
                where: {
                    recipeId: recipe.id
                }
            })

            for (let ingredientName of data.ingredients) {
                await this.service.ingredient.create({
                    data: {
                        name: ingredientName,
                        recipeId: recipe.id
                    }
                })
            }
        }

        return await this.service.recipe.findUnique({ where: { id: recipe.id }, include: { ingredients: true } })
    }

    async delete(id: number): Promise<void> {
        const recipe = await this.service.recipe.findUnique({ where: { id } })
        if (recipe == null) {
            throw new HttpException(`The recipe with ID ${id} does not exist!`, HttpStatus.NOT_FOUND)
        }

        await this.service.recipe.delete({ where: { id } })

        throw new HttpException(`The recipe with ID ${id} has been successfully deleted.`, HttpStatus.OK)
    }
}