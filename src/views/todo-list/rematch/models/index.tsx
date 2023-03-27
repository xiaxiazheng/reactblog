// @filename: models.ts
import { Models } from "@rematch/core"
import { edit } from "./edit";
 
export interface RootModel extends Models<RootModel> {
  edit: typeof edit
}
 
export const models: RootModel = { edit }