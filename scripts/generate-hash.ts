import { hashPassword } from '../src/lib/auth/password';
import { createUser } from '../src/lib/db/users';
import { prisma } from '../src/lib/db/prisma';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  Generate hash only:');
    console.log('    npx tsx scripts/generate-hash.ts <password>');
    console.log('');
    console.log('  Create user:');
    console.log('    npx tsx scripts/generate-hash.ts --create <username> <password>');
    process.exit(1);
  }

  if (args[0] === '--create') {
    const [, username, password] = args;
    
    if (!username || !password) {
      console.error('Error: Missing required arguments');
      console.log('Usage: npx tsx scripts/generate-hash.ts --create <username> <password>');
      process.exit(1);
    }

    try {
      const hashedPassword = await hashPassword(password);
      const user = await createUser({
        username,
        password: hashedPassword,
      });

      console.log('✅ Usuario creado exitosamente:');
      console.log('ID:', user.id);
      console.log('Usuario:', user.username);
    } catch (error) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'P2002') {
        console.error('❌ Error: El usuario ya existe');
      } else {
        console.error('❌ Error al crear usuario:', err.message || 'Error desconocido');
      }
      process.exit(1);
    } finally {
      await prisma.$disconnect();
    }
  } else {
    const password = args[0];
    const hash = await hashPassword(password);
    console.log('Password hash:');
    console.log(hash);
    await prisma.$disconnect();
  }
}

main();
