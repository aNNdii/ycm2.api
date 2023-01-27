import { Token } from "../infrastructures/Container";
import { GuildSkill } from "../interfaces/Guild";

import Service, { IService } from "./Service";

const SkillIdOffset = 150

export const GameGuildServiceToken = new Token<IGameGuildService>("GameGuildService")

export type IGuildSkill = {
  id: GuildSkill
  level: number
}

export type IGameGuildService = IService & {
  parseGuildSkills(buffer: any[]): IGuildSkill[]
}

export default class GameGuildService extends Service<any> implements IGameGuildService {

  parseGuildSkills(buffer: any[]): IGuildSkill[] {
    const skillCount = buffer.length
    const skills = []

    for (let i = 0; i < skillCount; i++) {
      const id = SkillIdOffset + i
      const level = parseInt(buffer[i])

      if (!GuildSkill[id]) continue
    
      skills.push({
        id,
        level
      })
    }
  
    return skills
  }

}
