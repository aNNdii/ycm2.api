import { EntityTableFilter } from "../interfaces/Entity";
import { GameMobTable } from "../interfaces/GameMob";
import Entity, { IEntity } from "./Entity";

export type GameMobProperties = EntityTableFilter<"mob_proto", GameMobTable>

export type IGameMob = IEntity & {
  id: number
  name: string
  localeName: string
  rank: number
  type: number
  battleType: number
  level: number
  size: number
  mount: number
  aiFlags: string[]
  raceFlags: string[]
  immuneFlags: string[]
  empire: number
  folder: string
  clickType: number
  strength: number
  dexterity: number
  health: number
  intelligence: number
  minDamage: number
  maxDamage: number
  maxHealth: number
  regenerationCycle: number
  regenerationPercent: number
  minMoney: number
  maxMoney: number
  experience: number
  defense: number
  attackSpeed: number
  attackRange: number
  aggressiveHealthPercent: number
  aggressiveSight: number
  movementSpeed: number
  resurrectionMobId: number
  enchantCurse: number
  enchantSlow: number
  enchantPoison: number
  enchantStun: number
  enchantCritical: number
  enchantPenetrate: number
  resistanceSword: number
  resistanceTwoHand: number
  resistanceDagger: number
  resistanceBell: number
  resistanceFan: number
  resistanceBow: number
  resistanceFire: number
  resistanceElectric: number
  resistanceMagic: number
  resistanceWind: number
  resistancePoison: number
  damageMultiplier: number
  summonMobId: number
  drain: number
  color: number
  polymorphItemId: number
  skillId0: number
  skillLevel0: number
  skillId1: number
  skillLevel1: number
  skillId2: number
  skillLevel2: number
  skillId3: number
  skillLevel3: number
  skillId4: number
  skillLevel4: number
  berserk: number
  stoneSkin: number
  godSpeed: number
  deathBlow: number
  revive: number
}

export default class GameMob extends Entity<GameMobProperties> implements IGameMob {

  get id() {
    return this.getProperty("mob_proto.vnum")
  }

  get name() {
    return this.getProperty("mob_proto.name")
  }

  get localeName() {
    return this.getProperty("mob_proto.locale_name")
  }

  get rank() {
    return this.getProperty("mob_proto.rank")
  }

  get type() {
    return this.getProperty("mob_proto.type")
  }

  get battleType() {
    return this.getProperty("mob_proto.battle_type")
  }

  get level() {
    return this.getProperty("mob_proto.level")
  }

  get size() {
    return this.getProperty("mob_proto.size")
  }

  get aiFlags() {
    return this.getProperty("mob_proto.ai_flag")
  }

  get mount() {
    return this.getProperty("mob_proto.mount_capacity")
  }

  get raceFlags() {
    return this.getProperty("mob_proto.setRaceFlag")
  }

  get immuneFlags() {
    return this.getProperty("mob_proto.setImmuneFlag")
  }

  get empire() {
    return this.getProperty("mob_proto.empire")
  }

  get folder() {
    return this.getProperty("mob_proto.folder")
  }

  get clickType() {
    return this.getProperty("mob_proto.on_click")
  }

  get strength() {
    return this.getProperty("mob_proto.st")
  }

  get dexterity() {
    return this.getProperty("mob_proto.dx")
  }

  get health() {
    return this.getProperty("mob_proto.ht")
  }

  get intelligence() {
    return this.getProperty("mob_proto.iq")
  }

  get minDamage() {
    return this.getProperty("mob_proto.damage_min")
  }

  get maxDamage() {
    return this.getProperty("mob_proto.damage_max")
  }

  get maxHealth() {
    return this.getProperty("mob_proto.max_hp")
  }

  get regenerationCycle() {
    return this.getProperty("mob_proto.regen_cycle")
  }

  get regenerationPercent() {
    return this.getProperty("mob_proto.regen_percent")
  }

  get minMoney() {
    return this.getProperty("mob_proto.gold_min")
  }

  get maxMoney() {
    return this.getProperty("mob_proto.gold_max")
  }

  get experience() {
    return this.getProperty("mob_proto.exp")
  }

  get defense() {
    return this.getProperty("mob_proto.def")
  }

  get attackSpeed() {
    return this.getProperty("mob_proto.attack_speed")
  }

  get attackRange() {
    return this.getProperty("mob_proto.attack_range")
  }

  get aggressiveHealthPercent() {
    return this.getProperty("mob_proto.aggressive_hp_pct")
  }

  get aggressiveSight() {
    return this.getProperty("mob_proto.aggressive_sight")
  }

  get movementSpeed() {
    return this.getProperty("mob_proto.move_speed")
  }
  
  get resurrectionMobId() {
    return this.getProperty("mob_proto.resurrection_vnum")
  }

  get enchantCurse() {
    return this.getProperty("mob_proto.enchant_curse")
  }

  get enchantSlow() {
    return this.getProperty("mob_proto.enchant_slow")
  }

  get enchantPoison() {
    return this.getProperty("mob_proto.enchant_poison")
  }

  get enchantStun() {
    return this.getProperty("mob_proto.enchant_stun")
  }

  get enchantCritical() {
    return this.getProperty("mob_proto.enchant_critical")
  }

  get enchantPenetrate() {
    return this.getProperty("mob_proto.enchant_penetrate")
  }

  get resistanceSword() {
    return this.getProperty("mob_proto.resist_sword")
  }

  get resistanceTwoHand() {
    return this.getProperty("mob_proto.resist_twohand")
  }

  get resistanceDagger() {
    return this.getProperty("mob_proto.resist_dagger")
  }

  get resistanceBell() {
    return this.getProperty("mob_proto.resist_bell")
  }

  get resistanceFan() {
    return this.getProperty("mob_proto.resist_fan")
  }

  get resistanceBow() {
    return this.getProperty("mob_proto.resist_fan")
  }

  get resistanceFire() {
    return this.getProperty("mob_proto.resist_fire")
  }

  get resistanceElectric() {
    return this.getProperty("mob_proto.resist_elect")
  }

  get resistanceMagic() {
    return this.getProperty("mob_proto.resist_magic")
  }

  get resistanceWind() {
    return this.getProperty("mob_proto.resist_wind")
  }
  
  get resistancePoison() {
    return this.getProperty("mob_proto.resist_poison")
  }

  get damageMultiplier() {
    return this.getProperty("mob_proto.dam_multiply")
  }

  get summonMobId() {
    return this.getProperty("mob_proto.summon")
  }

  get drain() {
    return this.getProperty("mob_proto.drain_sp")
  }

  get color() {
    return this.getProperty("mob_proto.mob_color")
  }

  get polymorphItemId() {
    return this.getProperty("mob_proto.polymorph_item")
  }

  get skillId0() {
    return this.getProperty("mob_proto.skill_vnum0")
  }

  get skillLevel0() {
    return this.getProperty("mob_proto.skill_level0")
  }

  get skillId1() {
    return this.getProperty("mob_proto.skill_vnum1")
  }

  get skillLevel1() {
    return this.getProperty("mob_proto.skill_level1")
  }

  get skillId2() {
    return this.getProperty("mob_proto.skill_vnum2")
  }

  get skillLevel2() {
    return this.getProperty("mob_proto.skill_level2")
  }

  get skillId3() {
    return this.getProperty("mob_proto.skill_vnum3")
  }

  get skillLevel3() {
    return this.getProperty("mob_proto.skill_level3")
  }

  get skillId4() {
    return this.getProperty("mob_proto.skill_vnum4")
  }

  get skillLevel4() {
    return this.getProperty("mob_proto.skill_level4")
  }

  get berserk() {
    return this.getProperty("mob_proto.sp_berserk")
  }

  get stoneSkin() {
    return this.getProperty("mob_proto.sp_stoneskin")
  }

  get godSpeed() {
    return this.getProperty("mob_proto.sp_godspeed")
  }

  get deathBlow() {
    return this.getProperty("mob_proto.sp_deathblow")
  }

  get revive() {
    return this.getProperty("mob_proto.sp_revive")
  }


}