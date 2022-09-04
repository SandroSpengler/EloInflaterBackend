import { Document } from "mongoose";

/**
 * @openapi
 * components:
 *  schemas:
 *   Match:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       metadata:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *            dataVersion:
 *              type: string
 *            matchId:
 *              type: string
 *            participants:
 *              type: array
 *              items:
 *                type: string
 *            createdAt:
 *              type: string
 *            updatedAt:
 *              type: string
 *       info:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             gameCreation:
 *               type: integer
 *             gameDuration:
 *               type: integer
 *             gameEndTimestamp:
 *               type: integer
 *             gameId:
 *               type: integer
 *             gameMode:
 *               type: string
 *             gameName:
 *               type: string
 *             gameType:
 *               type: string
 *             gameVersion:
 *               type: string
 *             mapId:
 *               type: integer
 *             platformId:
 *               type: string
 *             queueId:
 *               type: integer
 *             tournamentCode:
 *               type: string
 *             participants:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   assists:
 *                     type: integer
 *                   baronKills:
 *                     type: integer
 *                   bountyLevel:
 *                     type: integer
 *                   champExperience:
 *                     type: integer
 *                   champLevel:
 *                     type: integer
 *                   championId:
 *                     type: integer
 *                   championName:
 *                     type: string
 *                   championTransform:
 *                     type: integer
 *                   consumablesPurchased:
 *                     type: integer
 *                   damageDealtToBuildings:
 *                     type: integer
 *                   damageDealtToObjectives:
 *                     type: integer
 *                   damageDealtToTurrets:
 *                     type: integer
 *                   damageSelfMitigated:
 *                     type: integer
 *                   deaths:
 *                     type: integer
 *                   detectorWardsPlaced:
 *                     type: integer
 *                   doubleKills:
 *                     type: integer
 *                   dragonKills:
 *                     type: integer
 *                   firstBloodAssist:
 *                     type: boolean
 *                   firstBloodKill:
 *                     type: boolean
 *                   firstTowerAssist:
 *                     type: boolean
 *                   firstTowerKill:
 *                     type: boolean
 *                   gameEndedInEarlySurrender:
 *                     type: boolean
 *                   gameEndedInSurrender:
 *                     type: boolean
 *                   goldEarned:
 *                     type: integer
 *                   goldSpent:
 *                     type: integer
 *                   individualPosition:
 *                     type: string
 *                   inhibitorKills:
 *                     type: integer
 *                   inhibitorTakedowns:
 *                     type: integer
 *                   inhibitorsLost:
 *                     type: integer
 *                   item0:
 *                     type: integer
 *                   item1:
 *                     type: integer
 *                   item2:
 *                     type: integer
 *                   item3:
 *                     type: integer
 *                   item4:
 *                     type: integer
 *                   item5:
 *                     type: integer
 *                   item6:
 *                     type: integer
 *                   itemsPurchased:
 *                     type: integer
 *                   killingSprees:
 *                     type: integer
 *                   kills:
 *                     type: integer
 *                   lane:
 *                     type: string
 *                   largestCriticalStrike:
 *                     type: integer
 *                   largestKillingSpree:
 *                     type: integer
 *                   longestTimeSpentLiving:
 *                     type: integer
 *                   magicDamageDealt:
 *                     type: integer
 *                   magicDamageDealtToChampions:
 *                     type: integer
 *                   magicDamageTaken:
 *                     type: integer
 *                   neutralMinionsKilled:
 *                     type: integer
 *                   nexusKills:
 *                     type: integer
 *                   nexusLost:
 *                     type: integer
 *                   nexusTakedowns:
 *                     type: integer
 *                   objectivesStolen:
 *                     type: integer
 *                   objectivesStolenAssists:
 *                     type: integer
 *                   participantId:
 *                     type: integer
 *                   pentaKills:
 *                     type: integer
 *                   physicalDamageDealt:
 *                     type: integer
 *                   physicalDamageDealtToChampions:
 *                     type: integer
 *                   physicalDamageTaken:
 *                     type: integer
 *                   profileIcon:
 *                     type: integer
 *                   puuid:
 *                     type: string
 *                   quadraKills:
 *                     type: integer
 *                   riotIdName:
 *                     type: string
 *                   riotIdTagline:
 *                     type: string
 *                   role:
 *                     type: string
 *                   sightWardsBoughtInGame:
 *                     type: integer
 *                   spell1Casts:
 *                     type: integer
 *                   spell2Casts:
 *                     type: integer
 *                   spell3Casts:
 *                     type: integer
 *                   spell4Casts:
 *                     type: integer
 *                   summoner1Casts:
 *                     type: integer
 *                   summoner1Id:
 *                     type: integer
 *                   summoner2Casts:
 *                     type: integer
 *                   summoner2Id:
 *                     type: integer
 *                   summonerId:
 *                     type: string
 *                   summonerLevel:
 *                     type: integer
 *                   summonerName:
 *                     type: string
 *                   teamEarlySurrendered:
 *                     type: boolean
 *                   teamId:
 *                     type: integer
 *                   teamPosition:
 *                     type: string
 *                   timeCCingOthers:
 *                     type: integer
 *                   timePlayed:
 *                     type: integer
 *                   totalDamageDealt:
 *                     type: integer
 *                   totalDamageDealtToChampions:
 *                     type: integer
 *                   totalDamageShieldedOnTeammates:
 *                     type: integer
 *                   totalDamageTaken:
 *                     type: integer
 *                   totalHeal:
 *                     type: integer
 *                   totalHealsOnTeammates:
 *                     type: integer
 *                   totalMinionsKilled:
 *                     type: integer
 *                   totalTimeCCDealt:
 *                     type: integer
 *                   totalTimeSpentDead:
 *                     type: integer
 *                   totalUnitsHealed:
 *                     type: integer
 *                   tripleKills:
 *                     type: integer
 *                   trueDamageDealt:
 *                     type: integer
 *                   trueDamageDealtToChampions:
 *                     type: integer
 *                   trueDamageTaken:
 *                     type: integer
 *                   turretKills:
 *                     type: integer
 *                   turretTakedowns:
 *                     type: integer
 *                   turretsLost:
 *                     type: integer
 *                   unrealKills:
 *                     type: integer
 *                   visionScore:
 *                     type: integer
 *                   visionWardsBoughtInGame:
 *                     type: integer
 *                   wardsKilled:
 *                     type: integer
 *                   wardsPlaced:
 *                     type: integer
 *                   win:
 *                     type: boolean
 *                   id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                   challenges:
 *                     type: object
 *                     properties:
 *                       abilityUses:
 *                         type: integer
 *                       acesBefore15Minutes:
 *                         type: integer
 *                       alliedJungleMonsterKills:
 *                         type: number
 *                       baronTakedowns:
 *                         type: integer
 *                       blastConeOppositeOpponentCount:
 *                         type: integer
 *                       bountyGold:
 *                         type: integer
 *                       buffsStolen:
 *                         type: integer
 *                       completeSupportQuestInTime:
 *                         type: integer
 *                       controlWardsPlaced:
 *                         type: integer
 *                       damagePerMinute:
 *                         type: number
 *                       damageTakenOnTeamPercentage:
 *                         type: number
 *                       dancedWithRiftHerald:
 *                         type: integer
 *                       deathsByEnemyChamps:
 *                         type: integer
 *                       dodgeSkillShotsSmallWindow:
 *                         type: integer
 *                       doubleAces:
 *                         type: integer
 *                       dragonTakedowns:
 *                         type: integer
 *                       effectiveHealAndShielding:
 *                         type: integer
 *                       elderDragonKillsWithOpposingSoul:
 *                         type: integer
 *                       elderDragonMultikills:
 *                         type: integer
 *                       enemyChampionImmobilizations:
 *                         type: integer
 *                       enemyJungleMonsterKills:
 *                         type: integer
 *                       epicMonsterKillsNearEnemyJungler:
 *                         type: integer
 *                       epicMonsterSteals:
 *                         type: integer
 *                       epicMonsterStolenWithoutSmite:
 *                         type: integer
 *                       flawlessAces:
 *                         type: integer
 *                       fullTeamTakedown:
 *                         type: integer
 *                       gameLength:
 *                         type: number
 *                       goldPerMinute:
 *                         type: number
 *                       hadAfkTeammate:
 *                         type: integer
 *                       hadOpenNexus:
 *                         type: integer
 *                       immobilizeAndKillWithAlly:
 *                         type: integer
 *                       initialBuffCount:
 *                         type: integer
 *                       initialCrabCount:
 *                         type: integer
 *                       jungleCsBefore10Minutes:
 *                         type: integer
 *                       junglerKillsEarlyJungle:
 *                         type: integer
 *                       junglerTakedownsNearDamagedEpicMonster:
 *                         type: integer
 *                       kTurretsDestroyedBeforePlatesFall:
 *                         type: integer
 *                       kda:
 *                         type: number
 *                       killAfterHiddenWithAlly:
 *                         type: integer
 *                       killParticipation:
 *                         type: number
 *                       killedChampTookFullTeamDamageSurvived:
 *                         type: integer
 *                       killsNearEnemyTurret:
 *                         type: integer
 *                       killsOnLanersEarlyJungleAsJungler:
 *                         type: integer
 *                       killsOnRecentlyHealedByAramPack:
 *                         type: integer
 *                       killsUnderOwnTurret:
 *                         type: integer
 *                       killsWithHelpFromEpicMonster:
 *                         type: integer
 *                       knockEnemyIntoTeamAndKill:
 *                         type: integer
 *                       landSkillShotsEarlyGame:
 *                         type: integer
 *                       laneMinionsFirst10Minutes:
 *                         type: integer
 *                       lostAnInhibitor:
 *                         type: integer
 *                       maxKillDeficit:
 *                         type: integer
 *                       moreEnemyJungleThanOpponent:
 *                         type: number
 *                       multiKillOneSpell:
 *                         type: integer
 *                       multiTurretRiftHeraldCount:
 *                         type: integer
 *                       multikills:
 *                         type: integer
 *                       multikillsAfterAggressiveFlash:
 *                         type: integer
 *                       outerTurretExecutesBefore10Minutes:
 *                         type: integer
 *                       outnumberedKills:
 *                         type: integer
 *                       outnumberedNexusKill:
 *                         type: integer
 *                       perfectDragonSoulsTaken:
 *                         type: integer
 *                       perfectGame:
 *                         type: integer
 *                       pickKillWithAlly:
 *                         type: integer
 *                       poroExplosions:
 *                         type: integer
 *                       quickCleanse:
 *                         type: integer
 *                       quickFirstTurret:
 *                         type: integer
 *                       quickSoloKills:
 *                         type: integer
 *                       riftHeraldTakedowns:
 *                         type: integer
 *                       saveAllyFromDeath:
 *                         type: integer
 *                       scuttleCrabKills:
 *                         type: integer
 *                       skillshotsDodged:
 *                         type: integer
 *                       skillshotsHit:
 *                         type: integer
 *                       snowballsHit:
 *                         type: integer
 *                       soloBaronKills:
 *                         type: integer
 *                       soloKills:
 *                         type: integer
 *                       soloTurretsLategame:
 *                         type: integer
 *                       stealthWardsPlaced:
 *                         type: integer
 *                       survivedSingleDigitHpCount:
 *                         type: integer
 *                       survivedThreeImmobilizesInFight:
 *                         type: integer
 *                       takedownOnFirstTurret:
 *                         type: integer
 *                       takedowns:
 *                         type: integer
 *                       takedownsAfterGainingLevelAdvantage:
 *                         type: integer
 *                       takedownsBeforeJungleMinionSpawn:
 *                         type: integer
 *                       takedownsFirst25Minutes:
 *                         type: integer
 *                       takedownsInAlcove:
 *                         type: integer
 *                       takedownsInEnemyFountain:
 *                         type: integer
 *                       teamBaronKills:
 *                         type: integer
 *                       teamDamagePercentage:
 *                         type: number
 *                       teamElderDragonKills:
 *                         type: integer
 *                       teamRiftHeraldKills:
 *                         type: integer
 *                       threeWardsOneSweeperCount:
 *                         type: integer
 *                       tookLargeDamageSurvived:
 *                         type: integer
 *                       turretPlatesTaken:
 *                         type: integer
 *                       turretTakedowns:
 *                         type: integer
 *                       turretsTakenWithRiftHerald:
 *                         type: integer
 *                       twentyMinionsIn3SecondsCount:
 *                         type: integer
 *                       unseenRecalls:
 *                         type: integer
 *                       visionScorePerMinute:
 *                         type: number
 *                       wardTakedowns:
 *                         type: integer
 *                       wardTakedownsBefore20M:
 *                         type: integer
 *                       wardsGuarded:
 *                         type: integer
 *                       _id:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *             teams:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                  teamId:
 *                    type: integer
 *                  win:
 *                    type: boolean
 *                  bans:
 *                    type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      championId:
 *                        type: integer
 *                      pickTurn:
 *                        type: integer
 *                      _id:
 *                        type: string
 *                      createdAt:
 *                        type: string
 *                      updatedAt:
 *                        type: string
 *                  objectives:
 *                    type: object
 *                    properties:
 *                      baron:
 *                        type: object
 *                        properties:
 *                          first:
 *                            type: boolean
 *                          kills:
 *                            type: integer
 *                          _id:
 *                            type: string
 *                          createdAt:
 *                            type: string
 *                          updatedAt:
 *                            type: string
 *                          champion:
 *                            type: object
 *                            properties:
 *                              first:
 *                                type: boolean
 *                              kills:
 *                                type: integer
 *                              _id:
 *                                type: string
 *                              createdAt:
 *                                type: string
 *                              updatedAt:
 *                                type: string
 *                          dragon:
 *                            type: object
 *                            properties:
 *                              first:
 *                                type: boolean
 *                              kills:
 *                                type: integer
 *                              _id:
 *                                type: string
 *                              createdAt:
 *                                type: string
 *                              updatedAt:
 *                                type: string
 *                          inhibitor:
 *                            type: object
 *                            properties:
 *                              first:
 *                                type: boolean
 *                              kills:
 *                                type: integer
 *                              _id:
 *                                type: string
 *                              createdAt:
 *                                type: string
 *                              updatedAt:
 *                                type: string
 *                          riftHerald:
 *                            type: object
 *                            properties:
 *                              first:
 *                                type: boolean
 *                              kills:
 *                                type: integer
 *                              _id:
 *                                type: string
 *                              createdAt:
 *                                type: string
 *                              updatedAt:
 *                                type: string
 *                          tower:
 *                            type: object
 *                            properties:
 *                              first:
 *                                type: boolean
 *                              kills:
 *                                type: integer
 *                              _id:
 *                                type: string
 *                              createdAt:
 *                                type: string
 *                              updatedAt:
 *                                type: string
 *                      _id:
 *                        type: string
 *                      createdAt:
 *                        type: string
 *                      updatedAt:
 *                        type: string
 *                _id:
 *                  type: string
 *                createdAt:
 *                  type: string
 *                updatedAt:
 *                  type: string
 *           createdAt:
 *             type: string
 *           updatedAt:
 *             type: string
 *           __v:
 *             type: integer
 */

export interface Metadata {
  dataVersion: string;
  matchId: string;
  participants: string[];
}

export interface Challenges {
  AssistStreakCount: number;
  abilityUses: number;
  acesBefore15Minutes: number;
  alliedJungleMonsterKills: number;
  baronTakedowns: number;
  blastConeOppositeOpponentCount: number;
  bountyGold: number;
  buffsStolen: number;
  completeSupportQuestInTime: number;
  controlWardsPlaced: number;
  damagePerMinute: number;
  damageTakenOnTeamPercentage: number;
  dancedWithRiftHerald: number;
  deathsByEnemyChamps: number;
  dodgeSkillShotsSmallWindow: number;
  doubleAces: number;
  dragonTakedowns: number;
  earlyLaningPhaseGoldExpAdvantage: number;
  effectiveHealAndShielding: number;
  elderDragonKillsWithOpposingSoul: number;
  elderDragonMultikills: number;
  enemyChampionImmobilizations: number;
  enemyJungleMonsterKills: number;
  epicMonsterKillsNearEnemyJungler: number;
  epicMonsterKillsWithin30SecondsOfSpawn: number;
  epicMonsterSteals: number;
  epicMonsterStolenWithoutSmite: number;
  flawlessAces: number;
  fullTeamTakedown: number;
  gameLength: number;
  getTakedownsInAllLanesEarlyJungleAsLaner: number;
  goldPerMinute: number;
  hadAfkTeammate: number;
  hadOpenNexus: number;
  initialBuffCount: number;
  initialCrabCount: number;
  jungleCsBefore10Minutes: number;
  junglerKillsEarlyJungle: number;
  junglerTakedownsNearDamagedEpicMonster: number;
  kTurretsDestroyedBeforePlatesFall: number;
  kda: number;
  killParticipation: number;
  killsNearEnemyTurret: number;
  killsOnLanersEarlyJungleAsJungler: number;
  killsOnOtherLanesEarlyJungleAsLaner: number;
  killsOnRecentlyHealedByAramPack: number;
  killsUnderOwnTurret: number;
  killsWithHelpFromEpicMonster: number;
  landSkillShotsEarlyGame: number;
  laneMinionsFirst10Minutes: number;
  laningPhaseGoldExpAdvantage: number;
  legendaryCount: number;
  lostAnInhibitor: number;
  maxCsAdvantageOnLaneOpponent: number;
  maxKillDeficit: number;
  maxLevelLeadLaneOpponent: number;
  moreEnemyJungleThanOpponent: number;
  multiKillOneSpell: number;
  multiTurretRiftHeraldCount: number;
  multikills: number;
  multikillsAfterAggressiveFlash: number;
  mythicItemUsed: number;
  outerTurretExecutesBefore10Minutes: number;
  outnumberedKills: number;
  outnumberedNexusKill: number;
  perfectDragonSoulsTaken: number;
  perfectGame: number;
  poroExplosions: number;
  quickCleanse: number;
  quickFirstTurret: number;
  quickSoloKills: number;
  riftHeraldTakedowns: number;
  scuttleCrabKills: number;
  skillshotsDodged: number;
  skillshotsHit: number;
  snowballsHit: number;
  soloBaronKills: number;
  soloKills: number;
  soloTurretsLategame: number;
  stealthWardsPlaced: number;
  survivedSingleDigitHpCount: number;
  takedownOnFirstTurret: number;
  takedowns: number;
  takedownsAfterGainingLevelAdvantage: number;
  takedownsBeforeJungleMinionSpawn: number;
  takedownsFirst25Minutes: number;
  takedownsInAlcove: number;
  takedownsInEnemyFountain: number;
  teamBaronKills: number;
  teamDamagePercentage: number;
  teamElderDragonKills: number;
  teamRiftHeraldKills: number;
  teleportTakedowns: number;
  threeWardsOneSweeperCount: number;
  turretPlatesTaken: number;
  turretTakedowns: number;
  turretsTakenWithRiftHerald: number;
  twentyMinionsIn3SecondsCount: number;
  unseenRecalls: number;
  visionScoreAdvantageLaneOpponent: number;
  visionScorePerMinute: number;
  wardTakedowns: number;
  wardTakedownsBefore20M: number;
  wardsGuarded: number;
  earliestDragonTakedown?: number;
  highestCrowdControlScore?: number;
  fasterSupportQuestCompletion?: number;
  baronBuffGoldAdvantageOverThreshold?: number;
  earliestBaron?: number;
  firstTurretKilledTime?: number;
  fastestLegendary?: number;
  shortestTimeToAceFromFirstTakedown?: number;
  highestChampionDamage?: number;
  highestWardKills?: number;
}

export interface StatPerks {
  defense: number;
  flex: number;
  offense: number;
}

export interface Selection {
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

export interface Style {
  description: string;
  selections: Selection[];
  style: number;
}

export interface Perks {
  statPerks: StatPerks;
  styles: Style[];
}

export interface Participant {
  assists: number;
  baronKills: number;
  bountyLevel: number;
  challenges: Challenges;
  champExperience: number;
  champLevel: number;
  championId: number;
  championName: string;
  championTransform: number;
  consumablesPurchased: number;
  damageDealtToBuildings: number;
  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  damageSelfMitigated: number;
  deaths: number;
  detectorWardsPlaced: number;
  doubleKills: number;
  dragonKills: number;
  firstBloodAssist: boolean;
  firstBloodKill: boolean;
  firstTowerAssist: boolean;
  firstTowerKill: boolean;
  gameEndedInEarlySurrender: boolean;
  gameEndedInSurrender: boolean;
  goldEarned: number;
  goldSpent: number;
  individualPosition: string;
  inhibitorKills: number;
  inhibitorTakedowns: number;
  inhibitorsLost: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  itemsPurchased: number;
  killingSprees: number;
  kills: number;
  lane: string;
  largestCriticalStrike: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  longestTimeSpentLiving: number;
  magicDamageDealt: number;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  neutralMinionsKilled: number;
  nexusKills: number;
  nexusLost: number;
  nexusTakedowns: number;
  objectivesStolen: number;
  objectivesStolenAssists: number;
  participantId: number;
  pentaKills: number;
  perks: Perks;
  physicalDamageDealt: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  profileIcon: number;
  puuid: string;
  quadraKills: number;
  riotIdName: string;
  riotIdTagline: string;
  role: string;
  sightWardsBoughtInGame: number;
  spell1Casts: number;
  spell2Casts: number;
  spell3Casts: number;
  spell4Casts: number;
  summoner1Casts: number;
  summoner1Id: number;
  summoner2Casts: number;
  summoner2Id: number;
  summonerId: string;
  summonerLevel: number;
  summonerName: string;
  teamEarlySurrendered: boolean;
  teamId: number;
  teamPosition: string;
  timeCCingOthers: number;
  timePlayed: number;
  totalDamageDealt: number;
  totalDamageDealtToChampions: number;
  totalDamageShieldedOnTeammates: number;
  totalDamageTaken: number;
  totalHeal: number;
  totalHealsOnTeammates: number;
  totalMinionsKilled: number;
  totalTimeCCDealt: number;
  totalTimeSpentDead: number;
  totalUnitsHealed: number;
  tripleKills: number;
  trueDamageDealt: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
  turretKills: number;
  turretTakedowns: number;
  turretsLost: number;
  unrealKills: number;
  visionScore: number;
  visionWardsBoughtInGame: number;
  wardsKilled: number;
  wardsPlaced: number;
  win: boolean;
}

export interface Ban {
  championId: number;
  pickTurn: number;
}

export interface Baron {
  first: boolean;
  kills: number;
}

export interface Champion {
  first: boolean;
  kills: number;
}

export interface Dragon {
  first: boolean;
  kills: number;
}

export interface Inhibitor {
  first: boolean;
  kills: number;
}

export interface RiftHerald {
  first: boolean;
  kills: number;
}

export interface Tower {
  first: boolean;
  kills: number;
}

export interface Objectives {
  baron: Baron;
  champion: Champion;
  dragon: Dragon;
  inhibitor: Inhibitor;
  riftHerald: RiftHerald;
  tower: Tower;
}

export interface Team {
  teamId: number;
  win: boolean;
  bans: Ban[];
  objectives: Objectives;
}

export interface Info {
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;
  gameId: number;
  gameMode: string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: string;
  gameVersion: string;
  mapId: number;
  participants: Participant[];
  platformId: string;
  queueId: number;
  teams: Team[];
  tournamentCode: string;
}

export interface MatchData extends Partial<Document> {
  _id: string;
  id: string;
  summonerId: string;
  summonerPUUID: string;
  metadata: Metadata;
  info: Info;
}
