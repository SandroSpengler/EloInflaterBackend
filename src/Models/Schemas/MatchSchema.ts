import * as mongoose from "mongoose";
import { Schema, Document, model } from "mongoose";
import { MatchData } from "../Interfaces/MatchData";

//#region MatchSchema
const Metadata: Schema = new Schema(
  {
    dataVersion: {
      type: String,
    },
    matchId: {
      type: String,
    },
    participants: {
      type: ["String"],
    },
    tabisAbused: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Challenges: Schema = new Schema(
  {
    AssistStreakCount: {
      type: Number,
    },
    abilityUses: {
      type: Number,
    },
    acesBefore15Minutes: {
      type: Number,
    },
    alliedJungleMonsterKills: {
      type: Number,
    },
    baronTakedowns: {
      type: Number,
    },
    blastConeOppositeOpponentCount: {
      type: Number,
    },
    bountyGold: {
      type: Number,
    },
    buffsStolen: {
      type: Number,
    },
    completeSupportQuestInTime: {
      type: Number,
    },
    controlWardsPlaced: {
      type: Number,
    },
    damagePerMinute: {
      type: Number,
    },
    damageTakenOnTeamPercentage: {
      type: Number,
    },
    dancedWithRiftHerald: {
      type: Number,
    },
    deathsByEnemyChamps: {
      type: Number,
    },
    dodgeSkillShotsSmallWindow: {
      type: Number,
    },
    doubleAces: {
      type: Number,
    },
    dragonTakedowns: {
      type: Number,
    },
    earliestBaron: {
      type: Number,
    },
    effectiveHealAndShielding: {
      type: Number,
    },
    elderDragonKillsWithOpposingSoul: {
      type: Number,
    },
    elderDragonMultikills: {
      type: Number,
    },
    enemyChampionImmobilizations: {
      type: Number,
    },
    enemyJungleMonsterKills: {
      type: Number,
    },
    epicMonsterKillsNearEnemyJungler: {
      type: Number,
    },
    epicMonsterSteals: {
      type: Number,
    },
    epicMonsterStolenWithoutSmite: {
      type: Number,
    },
    firstTurretKilledTime: {
      type: Number,
    },
    flawlessAces: {
      type: Number,
    },
    fullTeamTakedown: {
      type: Number,
    },
    gameLength: {
      type: Number,
    },
    getTakedownsInAllLanesEarlyJungleAsLaner: {
      type: Number,
    },
    goldPerMinute: {
      type: Number,
    },
    hadAfkTeammate: {
      type: Number,
    },
    hadOpenNexus: {
      type: Number,
    },
    immobilizeAndKillWithAlly: {
      type: Number,
    },
    initialBuffCount: {
      type: Number,
    },
    initialCrabCount: {
      type: Number,
    },
    jungleCsBefore10Minutes: {
      type: Number,
    },
    junglerKillsEarlyJungle: {
      type: Number,
    },
    junglerTakedownsNearDamagedEpicMonster: {
      type: Number,
    },
    kTurretsDestroyedBeforePlatesFall: {
      type: Number,
    },
    kda: {
      type: Number,
    },
    killAfterHiddenWithAlly: {
      type: Number,
    },
    killParticipation: {
      type: Number,
    },
    killedChampTookFullTeamDamageSurvived: {
      type: Number,
    },
    killsNearEnemyTurret: {
      type: Number,
    },
    killsOnLanersEarlyJungleAsJungler: {
      type: Number,
    },
    killsOnOtherLanesEarlyJungleAsLaner: {
      type: Number,
    },
    killsOnRecentlyHealedByAramPack: {
      type: Number,
    },
    killsUnderOwnTurret: {
      type: Number,
    },
    killsWithHelpFromEpicMonster: {
      type: Number,
    },
    knockEnemyIntoTeamAndKill: {
      type: Number,
    },
    landSkillShotsEarlyGame: {
      type: Number,
    },
    laneMinionsFirst10Minutes: {
      type: Number,
    },
    lostAnInhibitor: {
      type: Number,
    },
    maxKillDeficit: {
      type: Number,
    },
    moreEnemyJungleThanOpponent: {
      type: Number,
    },
    multiKillOneSpell: {
      type: Number,
    },
    multiTurretRiftHeraldCount: {
      type: Number,
    },
    multikills: {
      type: Number,
    },
    multikillsAfterAggressiveFlash: {
      type: Number,
    },
    outerTurretExecutesBefore10Minutes: {
      type: Number,
    },
    outnumberedKills: {
      type: Number,
    },
    outnumberedNexusKill: {
      type: Number,
    },
    perfectDragonSoulsTaken: {
      type: Number,
    },
    perfectGame: {
      type: Number,
    },
    pickKillWithAlly: {
      type: Number,
    },
    poroExplosions: {
      type: Number,
    },
    quickCleanse: {
      type: Number,
    },
    quickFirstTurret: {
      type: Number,
    },
    quickSoloKills: {
      type: Number,
    },
    riftHeraldTakedowns: {
      type: Number,
    },
    saveAllyFromDeath: {
      type: Number,
    },
    scuttleCrabKills: {
      type: Number,
    },
    skillshotsDodged: {
      type: Number,
    },
    skillshotsHit: {
      type: Number,
    },
    snowballsHit: {
      type: Number,
    },
    soloBaronKills: {
      type: Number,
    },
    soloKills: {
      type: Number,
    },
    soloTurretsLategame: {
      type: Number,
    },
    stealthWardsPlaced: {
      type: Number,
    },
    survivedSingleDigitHpCount: {
      type: Number,
    },
    survivedThreeImmobilizesInFight: {
      type: Number,
    },
    takedownOnFirstTurret: {
      type: Number,
    },
    takedowns: {
      type: Number,
    },
    takedownsAfterGainingLevelAdvantage: {
      type: Number,
    },
    takedownsBeforeJungleMinionSpawn: {
      type: Number,
    },
    takedownsFirst25Minutes: {
      type: Number,
    },
    takedownsInAlcove: {
      type: Number,
    },
    takedownsInEnemyFountain: {
      type: Number,
    },
    teamBaronKills: {
      type: Number,
    },
    teamDamagePercentage: {
      type: Number,
    },
    teamElderDragonKills: {
      type: Number,
    },
    teamRiftHeraldKills: {
      type: Number,
    },
    teleportTakedowns: {
      type: Number,
    },
    threeWardsOneSweeperCount: {
      type: Number,
    },
    tookLargeDamageSurvived: {
      type: Number,
    },
    turretPlatesTaken: {
      type: Number,
    },
    turretTakedowns: {
      type: Number,
    },
    turretsTakenWithRiftHerald: {
      type: Number,
    },
    twentyMinionsIn3SecondsCount: {
      type: Number,
    },
    unseenRecalls: {
      type: Number,
    },
    visionScorePerMinute: {
      type: Number,
    },
    wardTakedowns: {
      type: Number,
    },
    wardTakedownsBefore20M: {
      type: Number,
    },
    wardsGuarded: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Participants: Schema = new Schema(
  {
    assists: {
      type: Number,
    },
    baronKills: {
      type: Number,
    },
    bountyLevel: {
      type: Number,
    },
    champExperience: {
      type: Number,
    },
    champLevel: {
      type: Number,
    },
    championId: {
      type: Number,
    },
    championName: {
      type: String,
    },
    championTransform: {
      type: Number,
    },
    consumablesPurchased: {
      type: Number,
    },
    damageDealtToBuildings: {
      type: Number,
    },
    damageDealtToObjectives: {
      type: Number,
    },
    damageDealtToTurrets: {
      type: Number,
    },
    damageSelfMitigated: {
      type: Number,
    },
    deaths: {
      type: Number,
    },
    detectorWardsPlaced: {
      type: Number,
    },
    doubleKills: {
      type: Number,
    },
    dragonKills: {
      type: Number,
    },
    firstBloodAssist: {
      type: Boolean,
    },
    firstBloodKill: {
      type: Boolean,
    },
    firstTowerAssist: {
      type: Boolean,
    },
    firstTowerKill: {
      type: Boolean,
    },
    gameEndedInEarlySurrender: {
      type: Boolean,
    },
    gameEndedInSurrender: {
      type: Boolean,
    },
    goldEarned: {
      type: Number,
    },
    goldSpent: {
      type: Number,
    },
    individualPosition: {
      type: String,
    },
    inhibitorKills: {
      type: Number,
    },
    inhibitorTakedowns: {
      type: Number,
    },
    inhibitorsLost: {
      type: Number,
    },
    item0: {
      type: Number,
    },
    item1: {
      type: Number,
    },
    item2: {
      type: Number,
    },
    item3: {
      type: Number,
    },
    item4: {
      type: Number,
    },
    item5: {
      type: Number,
    },
    item6: {
      type: Number,
    },
    itemsPurchased: {
      type: Number,
    },
    killingSprees: {
      type: Number,
    },
    kills: {
      type: Number,
    },
    lane: {
      type: String,
    },
    largestCriticalStrike: {
      type: Number,
    },
    largestKillingSpree: {
      type: Number,
    },
    longestTimeSpentLiving: {
      type: Number,
    },
    magicDamageDealt: {
      type: Number,
    },
    magicDamageDealtToChampions: {
      type: Number,
    },
    magicDamageTaken: {
      type: Number,
    },
    neutralMinionsKilled: {
      type: Number,
    },
    nexusKills: {
      type: Number,
    },
    nexusLost: {
      type: Number,
    },
    nexusTakedowns: {
      type: Number,
    },
    objectivesStolen: {
      type: Number,
    },
    objectivesStolenAssists: {
      type: Number,
    },
    participantId: {
      type: Number,
    },
    pentaKills: {
      type: Number,
    },
    physicalDamageDealt: {
      type: Number,
    },
    physicalDamageDealtToChampions: {
      type: Number,
    },
    physicalDamageTaken: {
      type: Number,
    },
    profileIcon: {
      type: Number,
    },
    puuid: {
      type: String,
      index: true,
    },
    quadraKills: {
      type: Number,
    },
    riotIdName: {
      type: String,
    },
    riotIdTagline: {
      type: String,
    },
    role: {
      type: String,
    },
    sightWardsBoughtInGame: {
      type: Number,
    },
    spell1Casts: {
      type: Number,
    },
    spell2Casts: {
      type: Number,
    },
    spell3Casts: {
      type: Number,
    },
    spell4Casts: {
      type: Number,
    },
    summoner1Casts: {
      type: Number,
    },
    summoner1Id: {
      type: Number,
    },
    summoner2Casts: {
      type: Number,
    },
    summoner2Id: {
      type: Number,
    },
    summonerId: {
      type: String,
    },
    summonerLevel: {
      type: Number,
    },
    summonerName: {
      type: String,
    },
    teamEarlySurrendered: {
      type: Boolean,
    },
    teamId: {
      type: Number,
    },
    teamPosition: {
      type: String,
    },
    timeCCingOthers: {
      type: Number,
    },
    timePlayed: {
      type: Number,
    },
    totalDamageDealt: {
      type: Number,
    },
    totalDamageDealtToChampions: {
      type: Number,
    },
    totalDamageShieldedOnTeammates: {
      type: Number,
    },
    totalDamageTaken: {
      type: Number,
    },
    totalHeal: {
      type: Number,
    },
    totalHealsOnTeammates: {
      type: Number,
    },
    totalMinionsKilled: {
      type: Number,
    },
    totalTimeCCDealt: {
      type: Number,
    },
    totalTimeSpentDead: {
      type: Number,
    },
    totalUnitsHealed: {
      type: Number,
    },
    tripleKills: {
      type: Number,
    },
    trueDamageDealt: {
      type: Number,
    },
    trueDamageDealtToChampions: {
      type: Number,
    },
    trueDamageTaken: {
      type: Number,
    },
    turretKills: {
      type: Number,
    },
    turretTakedowns: {
      type: Number,
    },
    turretsLost: {
      type: Number,
    },
    unrealKills: {
      type: Number,
    },
    visionScore: {
      type: Number,
    },
    visionWardsBoughtInGame: {
      type: Number,
    },
    wardsKilled: {
      type: Number,
    },
    wardsPlaced: {
      type: Number,
    },
    win: {
      type: Boolean,
    },
    challenges: {
      type: Challenges,
    },
    // Skipping Perks
    // Skipping Styles
  },
  {
    timestamps: true,
  }
);

const Ban: Schema = new Schema(
  {
    championId: {
      type: Number,
    },
    pickTurn: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Baron: Schema = new Schema(
  {
    first: {
      type: Boolean,
    },
    kills: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
const Champion: Schema = new Schema(
  {
    first: {
      type: Boolean,
    },
    kills: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
const Dragon: Schema = new Schema(
  {
    first: {
      type: Boolean,
    },
    kills: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
const Inhibitor: Schema = new Schema(
  {
    first: {
      type: Boolean,
    },
    kills: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
const RiftHerald: Schema = new Schema(
  {
    first: {
      type: Boolean,
    },
    kills: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
const Tower: Schema = new Schema(
  {
    first: {
      type: Boolean,
    },
    kills: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Objectives: Schema = new Schema(
  {
    baron: {
      type: Baron,
    },
    champion: {
      type: Champion,
    },
    dragon: {
      type: Dragon,
    },
    inhibitor: {
      type: Inhibitor,
    },
    riftHerald: {
      type: RiftHerald,
    },
    tower: {
      type: Tower,
    },
  },
  {
    timestamps: true,
  }
);

const Team: Schema = new Schema(
  {
    teamId: {
      type: Number,
    },
    win: {
      type: Boolean,
    },
    bans: {
      type: [Ban],
    },
    objectives: {
      type: Objectives,
    },
  },
  {
    timestamps: true,
  }
);

const Info: Schema = new Schema(
  {
    gameCreation: {
      type: Number,
    },
    gameDuration: {
      type: Number,
    },
    gameEndTimestamp: {
      type: Number,
    },
    gameId: {
      type: Number,
    },
    gameMode: {
      type: String,
    },
    gameName: {
      type: String,
    },
    gameNgameStartTimestampame: {
      type: Number,
    },
    gameType: {
      type: String,
    },
    gameVersion: {
      type: String,
    },
    mapId: {
      type: Number,
    },
    platformId: {
      type: String,
    },
    queueId: {
      type: Number,
    },
    tournamentCode: {
      type: String,
    },
    participants: {
      type: [Participants],
    },
    teams: {
      type: [Team],
    },
  },
  {
    timestamps: true,
  }
);

const MatchSchema = new Schema(
  {
    _id: { type: String },
    id: { type: String },
    summonerId: { type: String },
    summonerPUUID: { type: String },
    metadata: {
      type: [Metadata],
    },
    info: {
      type: [Info],
    },
  },
  {
    timestamps: true,
  }
);

//#endregion
export default mongoose.model<MatchData>("MatchSchema", MatchSchema);
