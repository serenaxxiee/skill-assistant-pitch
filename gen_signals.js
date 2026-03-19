const fs = require('fs');
const p = 'C:/agent/skilluminator/data/signals.json';
const ts = '2026-03-19T18:30:00Z';
const d = {
  cycleNum:5, harvestedAt:ts, weekOf:'2026-03-16',
  workiqQueriesRun:[
    'What email threads did I send or receive most frequently in the past 7 days?',
    'Are there recurring email types I write regularly?',
    'Which emails required the most back-and-forth this past week