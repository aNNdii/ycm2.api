import { EntityTableFilter } from "../interfaces/Entity";
import { MobTable } from "../interfaces/Mob";

import Entity, { IEntity } from "./Entity";

export type MobProperties = EntityTableFilter<"mob", MobTable>

export type IMob = IEntity & {
  id: number
  name: string
  localeName: string
  rank: number
  type: number
  battleType: number
  level: number
  scalePercent: number
  size: number
  mount: number
  aiFlagId: number
  raceFlagId: number
  immuneFlagId: number
  empireId: number
  folder: string
  clickType: number
  strength: number
  dexterity: number
  health: number
  intelligence: number
  experience: number
  sungMaStrength: number
  sungMaDexterity: number
  sungMaHealth: number
  sungMaIntelligence: number
  defense: number
  attackSpeed: number
  movementSpeed: number
  minDamage: number
  maxDamage: number
  maxHealth: number
  minMoney: number
  maxMoney: number
  regenerationCycle: number
  regenerationPercent: number
  aggressiveHealthPercent: number
  aggressiveSight: number
  attackRange: number
  resurrectionMobId: number
  enchantCurse: number
  enchantSlow: number
  enchantPoison: number
  enchantStun: number
  enchantCritical: number
  enchantPenetrate: number
  resistanceFist: number
  resistanceSword: number
  resistanceTwoHand: number
  resistanceDagger: number
  resistanceBell: number
  resistanceFan: number
  resistanceBow: number
  resistanceClaw: number
  resistanceFire: number
  resistanceElectric: number
  resistanceMagic: number
  resistanceWind: number
  resistancePoison: number
  resistanceBleed: number
  resistanceDark: number
  resistanceIce: number
  resistanceEarth: number
  attributeElectric: number
  attributeFire: number
  attributeIce: number
  attributeWind: number
  attributeEarth: number
  damageMultiplier: number
  summonMobId: number
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
  drain: number
  berserk: number
  stoneSkin: number
  godSpeed: number
  deathBlow: number
  revive: number
  heal: number
  rangeAttackSpeed: number
  rangeCastSpeed: number
  healthRegeneration: number
  hitRange: number
  createdDate: string
  modifiedDate: string
}

export default class Mob extends Entity<MobProperties> implements IMob {

  get id() {
    return this.getProperty("mob.mob_id")
  }

  get name() {
    return this.getProperty("mob.mob_name")
  }

  get localeName() {
    return this.getProperty("mob.mob_locale_name")
  }

  get rank() {
    return this.getProperty("mob.mob_rank")
  }

  get type() {
    return this.getProperty("mob.mob_type")
  }

  get battleType() {
    return this.getProperty("mob.mob_battle_type")
  }

  get level() {
    return this.getProperty("mob.mob_level")
  }

  get scalePercent() {
    return this.getProperty("mob.mob_scale_percent")
  }

  get size() {
    return this.getProperty("mob.mob_size")
  }

  get mount() {
    return this.getProperty("mob.mob_mount")
  }

  get aiFlagId() {
    return this.getProperty("mob.mob_ai_flag_id")
  }

  get raceFlagId() {
    return this.getProperty("mob.mob_race_flag_id")
  }

  get immuneFlagId() {
    return this.getProperty("mob.mob_immune_flag_id")
  }

  get empireId() {
    return this.getProperty("mob.mob_empire_id")
  }

  get folder() {
    return this.getProperty("mob.mob_folder")
  }

  get clickType() {
    return this.getProperty("mob.mob_click_type")
  }

  get strength() {
    return this.getProperty("mob.mob_strength")
  }

  get dexterity() {
    return this.getProperty("mob.mob_dexterity")
  }

  get health() {
    return this.getProperty("mob.mob_health")
  }

  get intelligence() {
    return this.getProperty("mob.mob_intelligence")
  }

  get experience() {
    return this.getProperty("mob.mob_experience")
  }

  get sungMaStrength() {
    return this.getProperty("mob.mob_sung_ma_strength")
  }

  get sungMaDexterity() {
    return this.getProperty("mob.mob_sung_ma_dexterity")
  }

  get sungMaHealth() {
    return this.getProperty("mob.mob_sung_ma_health")
  }
  
  get sungMaIntelligence() {
    return this.getProperty("mob.mob_sung_ma_intelligence")
  }

  get sungMaExperience() {
    return this.getProperty("mob.mob_sung_ma_experience")
  }

  get defense() {
    return this.getProperty("mob.mob_defense")
  }

  get attackSpeed() {
    return this.getProperty("mob.mob_attack_speed")
  }

  get movementSpeed() {
    return this.getProperty("mob.mob_movement_speed")
  }

  get minDamage() {
    return this.getProperty("mob.mob_damage_min")
  }

  get maxDamage() {
    return this.getProperty("mob.mob_damage_max")
  }

  get maxHealth() {
    return this.getProperty("mob.mob_health_max")
  }

  get minMoney() {
    return this.getProperty("mob.mob_money_min")
  }

  get maxMoney() {
    return this.getProperty("mob.mob_money_max")
  }

  get regenerationCycle() {
    return this.getProperty("mob.mob_regeneration_cycle")
  }

  get regenerationPercent() {
    return this.getProperty("mob.mob_regeneration_percent")
  }

  get aggressiveHealthPercent() {
    return this.getProperty("mob.mob_aggressive_health_percent")
  }

  get aggressiveSight() {
    return this.getProperty("mob.mob_aggressive_sight")
  }

  get attackRange() {
    return this.getProperty("mob.mob_attack_range")
  }

  get resurrectionMobId() {
    return this.getProperty("mob.mob_resurrection_mob_id")
  }

  get enchantCurse() {
    return this.getProperty("mob.mob_enchant_curse")
  }

  get enchantSlow() {
    return this.getProperty("mob.mob_enchant_slow")
  }

  get enchantPoison() {
    return this.getProperty("mob.mob_enchant_poison")
  }

  get enchantStun() {
    return this.getProperty("mob.mob_enchant_stun")
  }

  get enchantCritical() {
    return this.getProperty("mob.mob_enchant_critical")
  }

  get enchantPenetrate() {
    return this.getProperty("mob.mob_enchant_penetrate")
  }

  get resistanceFist() {
    return this.getProperty("mob.mob_resistance_fist")
  }

  get resistanceSword() {
    return this.getProperty("mob.mob_resistance_sword")
  }

  get resistanceTwoHand() {
    return this.getProperty("mob.mob_resistance_two_hand")
  }

  get resistanceDagger() {
    return this.getProperty("mob.mob_resistance_dagger")
  }

  get resistanceBell() {
    return this.getProperty("mob.mob_resistance_bell")
  }

  get resistanceFan() {
    return this.getProperty("mob.mob_resistance_fan")
  }

  get resistanceBow() {
    return this.getProperty("mob.mob_resistance_bow")
  }

  get resistanceClaw() {
    return this.getProperty("mob.mob_resistance_claw")
  }

  get resistanceFire() {
    return this.getProperty("mob.mob_attribute_fire")
  }

  get resistanceElectric() {
    return this.getProperty("mob.mob_resistance_electric")
  }

  get resistanceMagic() {
    return this.getProperty("mob.mob_resistance_magic")
  }

  get resistanceWind() {
    return this.getProperty("mob.mob_resistance_wind")
  }

  get resistancePoison() {
    return this.getProperty("mob.mob_resistance_poison")
  }

  get resistanceBleed() {
    return this.getProperty("mob.mob_resistance_bleed")
  }

  get resistanceDark() {
    return this.getProperty("mob.mob_resistance_dark")
  }

  get resistanceIce() {
    return this.getProperty("mob.mob_resistance_ice")
  }

  get resistanceEarth() {
    return this.getProperty("mob.mob_resistance_earth")
  }

  get attributeElectric() {
    return this.getProperty("mob.mob_attribute_electric")
  }

  get attributeFire() {
    return this.getProperty("mob.mob_attribute_fire")
  }

  get attributeIce() {
    return this.getProperty("mob.mob_attribute_ice")
  }

  get attributeWind() {
    return this.getProperty("mob.mob_attribute_wind")
  }

  get attributeEarth() {
    return this.getProperty("mob.mob_attribute_earth")
  }

  get attributeDark() {
    return this.getProperty("mob.mob_attribute_dark")
  }

  get damageMultiplier() {
    return this.getProperty("mob.mob_damage_multiplier")
  }

  get summonMobId() {
    return this.getProperty("mob.mob_summon_mob_id")
  }

  get color() {
    return this.getProperty("mob.mob_color")
  }

  get polymorphItemId() {
    return this.getProperty("mob.mob_polymorph_item_id")
  }

  get skillId0() {
    return this.getProperty("mob.mob_skill_id0")
  }

  get skillLevel0() {
    return this.getProperty("mob.mob_skill_level0")
  }

  get skillId1() {
    return this.getProperty("mob.mob_skill_id1")
  }

  get skillLevel1() {
    return this.getProperty("mob.mob_skill_level1")
  }

  get skillId2() {
    return this.getProperty("mob.mob_skill_id1")
  }

  get skillLevel2() {
    return this.getProperty("mob.mob_skill_level1")
  }

  get skillId3() {
    return this.getProperty("mob.mob_skill_id3")
  }

  get skillLevel3() {
    return this.getProperty("mob.mob_skill_level3")
  }

  get skillId4() {
    return this.getProperty("mob.mob_skill_id4")
  }

  get skillLevel4() {
    return this.getProperty("mob.mob_skill_level4")
  }

  get drain() {
    return this.getProperty("mob.mob_drain")
  }

  get berserk() {
    return this.getProperty("mob.mob_berserk")
  }

  get stoneSkin() {
    return this.getProperty("mob.mob_stone_skin")
  }

  get godSpeed() {
    return this.getProperty("mob.mob_god_speed")
  }

  get deathBlow() {
    return this.getProperty("mob.mob_death_blow")
  }

  get revive() {
    return this.getProperty("mob.mob_revive")
  }

  get heal() {
    return this.getProperty("mob.mob_heal")
  }

  get rangeAttackSpeed() {
    return this.getProperty("mob.mob_range_attack_speed")
  }

  get rangeCastSpeed() {
    return this.getProperty("mob.mob_range_cast_speed")
  }

  get healthRegeneration() {
    return this.getProperty("mob.mob_health_regeneration")
  }

  get hitRange() {
    return this.getProperty("mob.mob_hit_range")
  }

  get createdDate() {
    return this.getProperty("mob.mob_created_date")
  }

  get modifiedDate() {
    return this.getProperty("mob.mob_modified_date")
  }

}