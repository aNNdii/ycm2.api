import { EntityTable } from "./Entity";

export type CharacterAffectTable = EntityTable & {
  dwPID: number
  bType: number
  bApplyOn: number
  lApplyValue: number
  dwFlag: number
  lDuration: number
  lSPCost: number
}


