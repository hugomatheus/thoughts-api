/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { SearchParamsInterface } from '../../../../domain/search.interface';

export function createOrder(params: SearchParamsInterface): object {
  return params.sort
    ? stringToObject(params.sort, params.sortDir ?? 'desc')
    : { id: 'desc' };
}

function stringToObject(field: string, orientation: string): object {
  const parts = field.split('.');
  const result = {};

  let current = result;
  for (let i = 0; i < parts.length - 1; i++) {
    current[parts[i]] = {};
    current = current[parts[i]];
  }

  current[parts[parts.length - 1]] = orientation ? orientation : 'desc';
  return result;
}
