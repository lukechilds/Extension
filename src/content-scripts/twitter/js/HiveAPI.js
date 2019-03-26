import { MESSAGES } from '../../../config';

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

  async getTwitterUserScore(id, clusterName = this.defaultCluster) {
    if (!id) {
      console.error('HiveExtension::HiveAPI::getTwitterUserScore::User ID is undefined');
      return {};
    }

    const { data, status } = await this.getTwitterUserData(id);

    let score = 0;
    let name = clusterName;
    let indexed = false;
    let rank = null;
    let followers = [];

    if (status === HIVE_API_FETCH_DATA_STATUS.SUCCESS) {
      if (clusterName === 'Highest') {
        const highestScoreCluster = data.clusters.slice().sort((a, b) => b.score - a.score)[0];

        name = highestScoreCluster.abbr;
        score = highestScoreCluster.score;
        rank = highestScoreCluster.rank;
        followers = highestScoreCluster.followers;
      } else {
        const cluster = data.clusters.find(item => item.abbr === clusterName);
        score = cluster.score;
        rank = cluster.rank;
        followers = cluster.followers;
      }

      indexed = true;
    }

    return { name, score, rank, indexed, followers };
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
      data = await this.fetchInBackgroundContext(`${this.host}/api/top-people/${id}`);
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

  fetchInBackgroundContext(url) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: MESSAGES.FETCH,
          url
        },
        ({ type, data, error }) => {
          if (type === MESSAGES.FETCH_SUCCESS) {
            resolve(data);
          } else {
            reject(error);
          }
        }
      );
    });
  }
}
