class HIVE_API_FETCH_DATA_STATUS {
  static SUCCESS = 'success';
  static ERROR = 'error';
}

export class HiveAPI {
  cache;
  host = '';
  defaultCluster = 'Crypto';

  constructor(_host, _defaultCluster, _cache) {
    this.host = _host;
    this.defaultCluster = _defaultCluster;
    this.cache = _cache;
  }

  async getTwitterUserScore(id, cluster = this.defaultCluster) {
    const { data, status } = await this.getTwitterUserData(id);

    let score = 0;
    let name = cluster;

    if (status === HIVE_API_FETCH_DATA_STATUS.SUCCESS) {
      if (cluster === 'Highest') {
        const highestScoreCluster = data.clusters.slice().sort((a, b) => b.score - a.score)[0];

        name = highestScoreCluster.abbr;
        score = highestScoreCluster.score;
      } else {
        score = data.clusters.find(item => item.abbr === cluster).score;
      }
    }

    return { name, score };
  }

  async getTwitterUserClusters(id) {
    const { data, status } = await this.getTwitterUserData(id);

    let clusters = [];

    if (status === HIVE_API_FETCH_DATA_STATUS.SUCCESS) {
      clusters = data.clusters;
    }

    return clusters;
  }

  async getTwitterUserData(id) {
    const cacheKey = this.getUserScoreStoringCacheKey(id);
    const cachedData = await this.cache.get(cacheKey);

    if (typeof cachedData !== 'undefined' && cachedData !== null) {
      return cachedData;
    }

    let status, data;

    try {
      const response = await fetch(`${this.host}/api/top-people/${id}`);
      data = await response.json();
      status = HIVE_API_FETCH_DATA_STATUS.SUCCESS;
    } catch (error) {
      status = HIVE_API_FETCH_DATA_STATUS.ERROR;
    }

    const fetchingInfo = {
      data,
      status
    };

    await this.cache.save(cacheKey, fetchingInfo);

    return fetchingInfo;
  }

  getUserScoreStoringCacheKey(id) {
    return `user_${id}_allCrypto_score`;
  }
}
