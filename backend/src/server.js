import 'dotenv/config';
import app from './app.js';
import { bootstrapUsers } from './repositories/usersRepository.js';
import { bootstrapFiles } from './repositories/filesRepository.js';
import { evidenceBucket, storageEnabled, supabase } from './config/supabase.js';

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  try {
    await bootstrapUsers();
    await bootstrapFiles();
    if (storageEnabled) {
      const { data: bucket, error: bucketError } = await supabase.storage.getBucket(evidenceBucket);
      if (bucketError && !bucketError.message.toLowerCase().includes('not found')) throw bucketError;
      if (!bucket) {
        const { error } = await supabase.storage.createBucket(evidenceBucket, { public: false });
        if (error) throw error;
      } else if (bucket.public) {
        const { error } = await supabase.storage.updateBucket(evidenceBucket, { public: false });
        if (error) throw error;
      }
    }
    console.log('Inicialização de dados concluída.');
  } catch (error) {
    console.error('Falha na inicialização de dados:', error.message);
  }
}

const server = app.listen(PORT, () => console.log(`API Industrial Knowledge rodando na porta ${PORT}`));

server.on('error', (error) => {
  console.error(`Falha ao abrir a porta ${PORT}:`, error.message);
  process.exit(1);
});

bootstrap();
