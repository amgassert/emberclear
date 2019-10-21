import { getStatus } from 'poll-pr-status';

import { repository } from '../../frontend/package';

import { startServer } from './start-server';

export function setupEndpoint() {
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
  });
}
