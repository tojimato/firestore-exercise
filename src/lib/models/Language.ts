import DefaultDataReference from "../database/DefaultDataReference";

export type Language = {
    name: string,
    localeName:string,
    code: string,
    description?: string,
} & DefaultDataReference



