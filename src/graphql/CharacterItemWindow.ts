import { GraphQLEnumType } from "graphql";

import { CharacterItemWindow } from "../interfaces/CharacterItem";

const GraphQLCharacterItemWindow = new GraphQLEnumType({
  name: 'CharacterItemWindow',
  values: {
    [CharacterItemWindow[CharacterItemWindow.EQUIPMENT].toLowerCase()]: { value: CharacterItemWindow.EQUIPMENT },
    [CharacterItemWindow[CharacterItemWindow.INVENTORY].toLowerCase()]: { value: CharacterItemWindow.INVENTORY },
    [CharacterItemWindow[CharacterItemWindow.SAFEBOX].toLowerCase()]: { value: CharacterItemWindow.SAFEBOX },
    [CharacterItemWindow[CharacterItemWindow.MALL].toLowerCase()]: { value: CharacterItemWindow.MALL },
    [CharacterItemWindow[CharacterItemWindow.DRAGON_SOUL_INVENTORY].toLowerCase()]: { value: CharacterItemWindow.DRAGON_SOUL_INVENTORY },
    [CharacterItemWindow[CharacterItemWindow.BELT_INVENTORY].toLowerCase()]: { value: CharacterItemWindow.BELT_INVENTORY },
  }
})

export default GraphQLCharacterItemWindow