import 'dotenv/config';
import app from './app.js';
import { bootstrapUsers } from './repositories/usersRepository.js';
import { bootstrapFiles } from './repositories/filesRepository.js';
import { evidenceBucket, storageEnabled, supabase } from './config/supabase.js';

const PORT = process.env.PORT || 3001;

async function start() {
  await bootstrapUsers();
  await bootstrapFiles();
  if (storageEnabled) { const { error } = await supabase.storage.createBucket(evidenceBucket, { public: true }); if (error && !error.message.toLowerCase().includes('already exists')) throw error; }
  app.listen(PORT, () => console.log(`API Industrial Knowledge rodando na porta ${PORT}`));
}

start().catch((error) => { console.error('Falha ao iniciar a API:', error.message); process.exit(1); });
