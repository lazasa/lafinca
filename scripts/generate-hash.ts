import { hashPassword } from '../src/lib/auth/password';

async function generateHash() {
  const password = process.argv[2];
  
  if (!password) {
    console.error('Usage: tsx scripts/generate-hash.ts <password>');
    process.exit(1);
  }

  const hash = await hashPassword(password);
  console.log('Password hash:');
  console.log(hash);
}

generateHash();
