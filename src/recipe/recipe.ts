import { IsNotEmpty } from "class-validator"

export class RecipeRequestDTO {
    @IsNotEmpty({message: "Name is a requirement"})
    name: string

    @IsNotEmpty({message: "Description is a requirement"})
    description: string

    @IsNotEmpty({message: "Ingredients is a requirement"})
    ingredients: string[]
}

export class RecipeUpdateDTO {
    name: string
    description: string
    ingredients: string[]
}

export class RecipeResponseDTO {
    name: string
    description: string
}