const { getStatus } = require('poll-pr-status');

const { repository } = require('../../frontend/package');

const { startServer } = require('./start-server');

/**
 * Adds this.host, and this.server
 */
function setupEndpoint() {
  before(async function() {
    switch (process.env.WEBDRIVER_TARGET) {
      case 'pull-request': {
        // wait for the netlify job to start
        this.timeout(5 * 60 * 1000);

        let status = await getStatus({
          repository,
          context: 'deploy/netlify',
        });

        this.host = status.target_url;

        break;
      }
      case 'local': {
        let serverInfo = await startServer();

        this.server = serverInfo.server;
        this.host = `http://localhost:${serverInfo.port}`;

        break;
      }
      default: {
        this.host = 'https://emberclear.io';

        break;
      }
    }

    if (process.env.VERBOSE) {
      console.info('Host:', this.host);
    }
  });

  after(async function() {
    if (this.server) {
      this.server.kill();

      await this.server;
    }
  });
}

module.exports = {
  setupEndpoint,
};
