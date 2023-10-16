import { Token } from "../infrastructures/Container";

import { CharacterSkill, CharacterSkillMastery } from "../interfaces/Character";

import { Service, IService } from "./Service";

const SkilLTableEntityLength = 6
const QuickSlotTableEntityLength = 2

const CharacterSkillIndexStart = 1
const CharacterSkillIndexEnd = 150

export const GameCharacterServiceToken = new Token<IGameCharacterService>("GameCharacterService")

export type ICharacterSkill = {
  id: CharacterSkill
  mastery: CharacterSkillMastery
  level: number
  nextReadTime: number
}

export type ICharacterQuickSlot = {
  id: number
  type: any
  value: any
}

export type IGameCharacterService = IService & {
  parseCharacterQuickSlot(buffer: any[]): ICharacterQuickSlot[]
  parseCharacterSkills(buffer: any[]): ICharacterSkill[]
}

export class GameCharacterService extends Service<any> implements IGameCharacterService {

  parseCharacterQuickSlot(buffer: any[]) {
    const quickSlotCount = buffer.length / QuickSlotTableEntityLength
    const quickSlots = []

    for (let i = 0; i < quickSlotCount; i++) {
      const id = i
      const index = i * QuickSlotTableEntityLength

      const type = parseInt(buffer[index])
      const value = parseInt(buffer[index+1])

      if (!type) continue

      quickSlots.push({
        id,
        type,
        value
      })
    }

    return quickSlots
  }

  parseCharacterSkills(buffer: any[]) {
    const skillCount = buffer.length / SkilLTableEntityLength
    const skills = []

    for (let i = 0; i < skillCount; i++) {
      if (i <= CharacterSkillIndexStart || i >= CharacterSkillIndexEnd || !CharacterSkill[i]) continue

      const id = i
      const index = i * SkilLTableEntityLength

      const mastery = buffer[index]
      const level = buffer[index+1]

      const nextReadTime = (
        (buffer[index+2]) + 
        (buffer[index+3] << 8) + 
        (buffer[index+4] << 16) +
        (buffer[index+5] << 24) 
      )

      skills.push({
        id,
        mastery,
        level,
        nextReadTime
      })
    }

    return skills
  }

}