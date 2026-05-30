import { build } from 'vite';

try {
  await build();
} catch (err) {
  if (err && err.errors && Array.isArray(err.errors)) {
    console.error('\n=== BUILD ERRORS ===');
    for (const e of err.errors) {
      console.error('---');
      console.error('message:', e.message);
      if (e.location) console.error('location:', JSON.stringify(e.location));
      if (e.frame) console.error('frame:', e.frame);
    }
    console.error('=== END ERRORS ===\n');
  } else {
    console.error('Build failed:', err);
  }
  process.exit(1);
}
