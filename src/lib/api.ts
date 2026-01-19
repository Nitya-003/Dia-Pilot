// API client for Dia-Pilot backend

const API_BASE_URL = '/api';

export interface MealAnalysisResponse {
    carbs_estimate: number;
    meal_type: string | null;
    confidence: number;
    message: string;
}

export interface MealLogResponse {
    id: number;
    user_id: number;
    image_path: string;
    carbs_estimate: number;
    meal_type: string | null;
    confidence: number;
    notes: string | null;
    created_at: string;
}

// Meal APIs
export async function uploadMealPhoto(file: File): Promise<MealAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/meals/snap`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to upload meal photo');
    }

    return response.json();
}

export async function getMealHistory(limit: number = 10): Promise<MealLogResponse[]> {
    const response = await fetch(`${API_BASE_URL}/meals/history?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch meal history');
    return response.json();
}

// Glucose APIs
export async function getGlucoseStats() {
    const response = await fetch(`${API_BASE_URL}/glucose/stats`);
    if (!response.ok) throw new Error('Failed to fetch glucose stats');
    return response.json();
}

export async function getGlucosePredictions() {
    const response = await fetch(`${API_BASE_URL}/glucose/predictions`);
    if (!response.ok) throw new Error('Failed to fetch predictions');
    return response.json();
}

export async function getCrashGuard() {
    const response = await fetch(`${API_BASE_URL}/glucose/crash-guard`);
    if (!response.ok) throw new Error('Failed to fetch crash guard');
    return response.json();
}

// Predictions API
export async function simulateGlucose(scenario: string, mealCarbs?: number, exerciseDuration?: number) {
    const response = await fetch(`${API_BASE_URL}/predictions/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, meal_carbs: mealCarbs, exercise_duration: exerciseDuration }),
    });
    if (!response.ok) throw new Error('Failed to run simulation');
    return response.json();
}

// Voice API
export async function processVoiceCommand(transcript: string) {
    const response = await fetch(`${API_BASE_URL}/voice/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
    });
    if (!response.ok) throw new Error('Failed to process voice command');
    return response.json();
}

// Behavioral APIs
export async function getCoachingNudges() {
    const response = await fetch(`${API_BASE_URL}/behavioral/coaching`);
    if (!response.ok) throw new Error('Failed to fetch coaching nudges');
    return response.json();
}

export async function getGlucoseTwins() {
    const response = await fetch(`${API_BASE_URL}/behavioral/twins`);
    if (!response.ok) throw new Error('Failed to fetch glucose twins');
    return response.json();
}

// Clinician APIs
export async function getPatientTriage() {
    const response = await fetch(`${API_BASE_URL}/clinician/triage`);
    if (!response.ok) throw new Error('Failed to fetch triage');
    return response.json();
}

export async function getExecutiveSummary(patientId: number) {
    const response = await fetch(`${API_BASE_URL}/clinician/summary/${patientId}`);
    if (!response.ok) throw new Error('Failed to fetch summary');
    return response.json();
}

// Health Profile APIs
export async function submitHealthProfile(data: any) {
    const response = await fetch(`${API_BASE_URL}/health/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit health profile');
    return response.json();
}

export async function getHealthProfile() {
    const response = await fetch(`${API_BASE_URL}/health/profile`);
    if (!response.ok) throw new Error('Failed to fetch health profile');
    return response.json();
}

export async function getAIDiagnosis() {
    const response = await fetch(`${API_BASE_URL}/health/diagnose`, {
        method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to get diagnosis');
    return response.json();
}

export async function getDiagnosisHistory(limit = 5) {
    const response = await fetch(`${API_BASE_URL}/health/diagnoses?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch diagnosis history');
    return response.json();
}
