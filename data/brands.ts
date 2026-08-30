import { Brand } from '../types/service';

export const brands: Brand[] = [
  { id: 'lg', name: 'LG', categories: ['ac', 'refrigerator', 'washing-machine', 'microwave', 'television'] },
  { id: 'samsung', name: 'Samsung', categories: ['ac', 'refrigerator', 'washing-machine', 'microwave', 'television'] },
  { id: 'daikin', name: 'Daikin', categories: ['ac'] },
  { id: 'voltas', name: 'Voltas', categories: ['ac', 'refrigerator'] },
  { id: 'whirlpool', name: 'Whirlpool', categories: ['refrigerator', 'washing-machine', 'microwave'] },
  { id: 'bosch', name: 'Bosch', categories: ['washing-machine', 'chimney'] },
  { id: 'ifb', name: 'IFB', categories: ['washing-machine', 'microwave'] },
  { id: 'kent', name: 'Kent RO', categories: ['water-purifier'] },
  { id: 'aquaguard', name: 'Aquaguard', categories: ['water-purifier'] },
  { id: 'havells', name: 'Havells', categories: ['geyser', 'water-purifier', 'television'] },
  { id: 'fabor', name: 'Faber', categories: ['chimney'] },
  { id: 'panasonic', name: 'Panasonic', categories: ['ac', 'television', 'microwave'] },
];

export default brands;
