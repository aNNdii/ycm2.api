import { MapEntityType } from "./Map";

export enum GameMapEntityType {
  M = MapEntityType.MOB,
  G = MapEntityType.MOB_GROUP,
  R = MapEntityType.MOB_GROUP_GROUP,
  S = MapEntityType.MOB_RANDOM_LOCATION,
  E = MapEntityType.EXCEPTION
}