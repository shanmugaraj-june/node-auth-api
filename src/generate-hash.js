const bcrypt = require('bcrypt');

async function main() {
  const hash = await bcrypt.hash('Test@123', 10);
  console.log(hash);
}
main();