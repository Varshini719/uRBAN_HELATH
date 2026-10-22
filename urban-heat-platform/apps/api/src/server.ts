import { app } from './app.js';
import { config } from './config.js';
import { connectCache } from './services/cache.js';

await connectCache();
app.listen(config.PORT,()=>console.log(`Urban Heat API running on http://localhost:${config.PORT}`));
