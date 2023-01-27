import { GraphQLEnumType } from "graphql";

import { CharacterJob } from "../interfaces/Character";

const GraphQLCharacterJob = new GraphQLEnumType({
  name: 'CharacterJob',
  values: {
    [CharacterJob[CharacterJob.WARRIOR_MALE].toLowerCase()]: { value: CharacterJob.WARRIOR_MALE },
    [CharacterJob[CharacterJob.WARRIOR_FEMALE].toLowerCase()]: { value: CharacterJob.WARRIOR_FEMALE },
    [CharacterJob[CharacterJob.ASSASSIN_MALE].toLowerCase()]: { value: CharacterJob.ASSASSIN_MALE },
    [CharacterJob[CharacterJob.ASSASSIN_FEMALE].toLowerCase()]: { value: CharacterJob.ASSASSIN_FEMALE },
    [CharacterJob[CharacterJob.SURA_MALE].toLowerCase()]: { value: CharacterJob.SURA_MALE },
    [CharacterJob[CharacterJob.SURA_FEMALE].toLowerCase()]: { value: CharacterJob.SURA_FEMALE },
    [CharacterJob[CharacterJob.SHAMAN_MALE].toLowerCase()]: { value: CharacterJob.SHAMAN_MALE },
    [CharacterJob[CharacterJob.SHAMAN_FEMALE].toLowerCase()]: { value: CharacterJob.SHAMAN_FEMALE },
  }
})

export default GraphQLCharacterJob