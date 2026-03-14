/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  const votes = {};
  const registered = new Set();
  const voted = new Set();
  const candidateMap = {};
  const candidateList = Array.isArray(candidates) ? candidates : [];
  for (const c of candidateList) {
    if (
      c &&
      typeof c === "object" &&
      typeof c.id === "string" &&
      typeof c.name === "string" &&
      typeof c.party === "string" &&
      !(c.id in candidateMap)
    ) {
      candidateMap[c.id] = { ...c };
      votes[c.id] = 0;
    }
  }
  return {
    registerVoter(voter) {
      if (
        !voter ||
        typeof voter !== 'object' ||
        typeof voter.id !== 'string' ||
        voter.id.trim() === "" ||
        typeof voter.name !== 'string' ||
        voter.name.trim() === "" ||
        !Number.isFinite(voter.age) ||
        voter.age < 18
      ) return false;
      if (registered.has(voter.id)) return false;
      registered.add(voter.id);
      return true;
    },
    castVote(voterId, candidateId, onSuccess, onError) {
      if (typeof onSuccess !== 'function' || typeof onError !== 'function') return null;
      if (!registered.has(voterId)) return onError("voter_not_registered");
      if (!candidateMap[candidateId]) return onError("candidate_not_found");
      if (voted.has(voterId)) return onError("already_voted");
      votes[candidateId]++;
      voted.add(voterId);
      return onSuccess({ voterId, candidateId });
    },
    getResults(sortFn) {
      const arr = Object.keys(candidateMap).map(id => ({ ...candidateMap[id], votes: votes[id] }));
      if (typeof sortFn === 'function') return arr.sort(sortFn);
      return arr.sort((a, b) => b.votes - a.votes);
    },
    getWinner() {
      const arr = Object.keys(candidateMap).map(id => ({ ...candidateMap[id], votes: votes[id] }));
      if (arr.every(c => c.votes === 0)) return null;
      arr.sort((a, b) => b.votes - a.votes);
      return arr[0];
    }
  };
}

export function createVoteValidator(rules) {
  return function(voter) {
    if (!rules || typeof rules !== 'object') return { valid: false, reason: "invalid_rules" };
    if (!voter || typeof voter !== 'object') return { valid: false, reason: "invalid_voter" };
    for (const field of rules.requiredFields || []) {
      if (!(field in voter)) return { valid: false, reason: `missing_${field}` };
    }
    if (typeof voter.age !== 'number' || voter.age < (rules.minAge || 18)) return { valid: false, reason: "age_restriction" };
    return { valid: true };
  };
}

export function countVotesInRegions(regionTree) {
  if (!regionTree || typeof regionTree !== 'object' || !Number.isFinite(regionTree.votes)) return 0;
  let sum = regionTree.votes;
  if (Array.isArray(regionTree.subRegions)) {
    for (const sub of regionTree.subRegions) {
      sum += countVotesInRegions(sub);
    }
  }
  return sum;
}

export function tallyPure(currentTally, candidateId) {
  const newTally = currentTally && typeof currentTally === "object" ? { ...currentTally } : {};
  newTally[candidateId] = (newTally[candidateId] || 0) + 1;
  return newTally;
}
