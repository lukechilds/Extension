export class HiveAPI {
  cache;
  host = '';

  constructor(_host, _cache) {
    this.host = _host;
    this.cache = _cache;
  }

  async getTwitterUserScore(id) {
    const cacheKey = this.getUserScoreStoringCacheKey(id);
    const cachedScore = await this.cache.get(cacheKey);

    if (typeof cachedScore !== 'undefined' && cachedScore !== null) {
      return cachedScore;
    }

    let score;

    try {
      const response = await fetch(`${this.host}/api/top-people/${id}`);
      const json = await response.json();

      const allCryptoCluster = json.clusters[0];

      score = allCryptoCluster.score;
    } catch (error) {
      score = 0;
    }

    await this.cache.save(cacheKey, score);

    return score;
  }

  getUserScoreStoringCacheKey(id) {
    return `user_${id}_allCrypto_score`;
  }
}
