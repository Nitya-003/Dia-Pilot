export const glucoseData = [
  { time: '6:00', value: 95 },
  { time: '7:00', value: 102 },
  { time: '8:00', value: 118 },
  { time: '9:00', value: 125 },
  { time: '10:00', value: 112 },
  { time: '11:00', value: 105 },
  { time: '12:00', value: 98 },
];

export const predictedGlucoseData = [
  { time: 'Now', value: 98, predicted: false },
  { time: '+30m', value: 105, predicted: true },
  { time: '+1h', value: 110, predicted: true },
  { time: '+1.5h', value: 108, predicted: true },
  { time: '+2h', value: 102, predicted: true },
  { time: '+2.5h', value: 97, predicted: true },
  { time: '+3h', value: 95, predicted: true },
];

export const simulatedScenarios = {
  baseline: [
    { time: 'Now', value: 98 },
    { time: '+30m', value: 102 },
    { time: '+1h', value: 105 },
    { time: '+1.5h', value: 103 },
    { time: '+2h', value: 100 },
  ],
  withMeal: [
    { time: 'Now', value: 98 },
    { time: '+30m', value: 135 },
    { time: '+1h', value: 165 },
    { time: '+1.5h', value: 145 },
    { time: '+2h', value: 118 },
  ],
  withExercise: [
    { time: 'Now', value: 98 },
    { time: '+30m', value: 88 },
    { time: '+1h', value: 82 },
    { time: '+1.5h', value: 85 },
    { time: '+2h', value: 92 },
  ],
};

export const mockPatients = [
  {
    id: 1,
    name: 'Sarah Johnson',
    age: 34,
    risk: 'low',
    avgGlucose: 112,
    lastReading: '15 min ago',
    trend: 'stable',
  },
  {
    id: 2,
    name: 'Michael Chen',
    age: 52,
    risk: 'high',
    avgGlucose: 178,
    lastReading: '5 min ago',
    trend: 'rising',
  },
  {
    id: 3,
    name: 'Emma Davis',
    age: 28,
    risk: 'medium',
    avgGlucose: 145,
    lastReading: '22 min ago',
    trend: 'falling',
  },
  {
    id: 4,
    name: 'James Wilson',
    age: 45,
    risk: 'low',
    avgGlucose: 105,
    lastReading: '8 min ago',
    trend: 'stable',
  },
];

export const glucoseTwins = [
  {
    id: 1,
    name: 'Alex M.',
    age: 31,
    matchScore: 94,
    avatar: 'AM',
    strategy: 'Morning walks before breakfast',
  },
  {
    id: 2,
    name: 'Jordan P.',
    age: 29,
    matchScore: 89,
    avatar: 'JP',
    strategy: 'Low-carb lunch routine',
  },
  {
    id: 3,
    name: 'Taylor R.',
    age: 33,
    matchScore: 87,
    avatar: 'TR',
    strategy: 'Evening exercise + protein snacks',
  },
];
