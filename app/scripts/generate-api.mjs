/* eslint-disable no-undef */
import { resolve } from 'path';

import { generateApi } from 'swagger-typescript-api';

generateApi({
  name: 'Api.ts',
  output: resolve(process.cwd(), './src/api'),
  input: resolve(process.cwd(), './swagger/kinopoisk.json'),
  httpClientType: 'axios',
});
