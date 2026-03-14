/**
 * 🏏 Cricket Player Stats Dashboard
 *
 * IPL ka stats dashboard bana raha hai tu! Har function ARROW FUNCTION
 * hona chahiye (const fn = () => ...). Regular function declarations
 * mat use karna — arrow functions ki practice karna hai!
 *
 * Functions (sab arrow functions honge):
 *
 *   1. calcStrikeRate(runs, balls)
 *      - Strike rate = (runs / balls) * 100, rounded to 2 decimal places
 *      - Agar balls <= 0 ya runs < 0, return 0
 *
 *   2. calcEconomy(runsConceded, overs)
 *      - Economy = runsConceded / overs, rounded to 2 decimal places
 *      - Agar overs <= 0 ya runsConceded < 0, return 0
 *
 *   3. calcBattingAvg(totalRuns, innings, notOuts = 0)
 *      - Batting avg = totalRuns / (innings - notOuts), rounded to 2 decimal places
 *      - Default notOuts = 0
 *      - Agar innings - notOuts <= 0, return 0
 *
 *   4. isAllRounder(battingAvg, economy)
 *      - Return true agar battingAvg > 30 AND economy < 8
 *
 *   5. getPlayerCard(player)
 *      - player object: { name, runs, balls, totalRuns, innings, notOuts, runsConceded, overs }
 *      - Return: { name, strikeRate, economy, battingAvg, isAllRounder }
 *      - Use the above functions internally
 *      - Agar player null/undefined hai ya name missing, return null
 *
 * Hint: Use const fn = (params) => expression or const fn = (params) => { ... }
 *
 * @example
 *   calcStrikeRate(45, 30)  // => 150
 *   calcEconomy(24, 4)      // => 6
 *   getPlayerCard({ name: "Jadeja", runs: 35, balls: 20, totalRuns: 2000, innings: 80, notOuts: 10, runsConceded: 1500, overs: 200 })
 *   // => { name: "Jadeja", strikeRate: 175, economy: 7.5, battingAvg: 28.57, isAllRounder: false }
 */
export const calcStrikeRate = (runs, balls) => {
  if (!Number.isFinite(runs) || !Number.isFinite(balls) || balls <= 0 || runs < 0) return 0;

  const strikeRate = (runs / balls) * 100;
  return Number(strikeRate.toFixed(2));
};

export const calcEconomy = (runsConceded, overs) => {
  if (!Number.isFinite(runsConceded) || !Number.isFinite(overs) || overs <= 0 || runsConceded < 0) return 0;

  const economy = runsConceded / overs;
  return Number(economy.toFixed(2));
};

export const calcBattingAvg = (totalRuns, innings, notOuts = 0) => {
  if (
    !Number.isFinite(totalRuns) ||
    !Number.isFinite(innings) ||
    !Number.isFinite(notOuts) ||
    totalRuns < 0 ||
    innings <= 0 ||
    notOuts < 0 ||
    innings - notOuts <= 0
  ) {
    return 0;
  }

  const battingAvg = totalRuns / (innings - notOuts);
  return Number(battingAvg.toFixed(2));
};

export const isAllRounder = (battingAvg, economy) =>
  Number.isFinite(battingAvg) && Number.isFinite(economy) && battingAvg > 30 && economy < 8;

export const getPlayerCard = (player) => {
  if (!player || typeof player !== "object" || typeof player.name !== "string" || player.name.trim() === "") {
    return null;
  }
  const strikeRate = calcStrikeRate(player.runs, player.balls);
  const economy = calcEconomy(player.runsConceded, player.overs);
  const battingAvg = calcBattingAvg(player.totalRuns, player.innings, player.notOuts);

  return {
    name: player.name,
    strikeRate,
    economy,
    battingAvg,
    isAllRounder: isAllRounder(battingAvg, economy)
  };
};
