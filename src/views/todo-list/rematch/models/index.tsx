// @filename: models.ts
import { Models } from "@rematch/core";
import { edit } from "./edit";
import { data } from "./data";
import { filter } from "./filter";
export interface RootModel extends Models<RootModel> {
    edit: typeof edit;
    data: typeof data;
    filter: typeof filter;
}
export const models: RootModel = { edit, data, filter };
