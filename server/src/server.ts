import app from './app';
import { ENV } from './config/env';

process.on('uncaughtException', (err) => {
    console.error('--- CRITICAL: UNCAUGHT EXCEPTION ---');
    console.error(err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('--- CRITICAL: UNHANDLED REJECTION ---');
    console.error('Reason:', reason);
});

const PORT = ENV.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
