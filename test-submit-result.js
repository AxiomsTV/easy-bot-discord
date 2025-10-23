import { config } from 'dotenv';
import { googleSheetsService } from './src/services/google/sheets.js';

config();

async function testSubmit() {
  const ok = await googleSheetsService.initialize();
  console.log('initialized:', ok);

  const result = await googleSheetsService.submitResult({
    teamName: 'Equipo Test 2',
    position: 2,
    totalKills: 25,
    multiplier: 1.4,
    finalScore: Math.round(25 * 1.4),
    submittedBy: 'Tester',
    userId: '1234'
  }, 'test-tournament-id');

  console.log('submit result returned:', result);
}

testSubmit().catch(console.error);
