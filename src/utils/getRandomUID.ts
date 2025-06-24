import 'react-native-get-random-values';
const { v4: uuidv4 } = require('uuid');

export function getRandomUID(): string {
  return uuidv4();
}
