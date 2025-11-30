import { OpenAPIObject } from '@nestjs/swagger';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { load } from 'js-yaml';

export const loadSwaggerDocument = async () => {
  const openApiPath = resolve(process.cwd(), 'doc/api.yaml');
  const fileContent = await readFile(openApiPath, 'utf8');

  return load(fileContent) as OpenAPIObject;
};
