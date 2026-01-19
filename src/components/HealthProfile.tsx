import { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Heart, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { submitHealthProfile, getAIDiagnosis } from '../lib/api';

export default function HealthProfile() {
    const [formData, setFormData] = useState({
        weight_kg: '',
        height_cm: '',
        hba1c: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        cholesterol_ldl: '',
        cholesterol_hdl: '',
        triglycerides: '',
        exercise_hours_per_week: '',
        sleep_hours_per_night: '',
        stress_level: 'medium',
        smoking_status: 'never',
    });

    const [loading, setLoading] = useState(false);
    const [diagnosis, setDiagnosis] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Convert string values to numbers
            const profileData = {
                weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : undefined,
                height_cm: formData.height_cm ? parseFloat(formData.height_cm) : undefined,
                hba1c: formData.hba1c ? parseFloat(formData.hba1c) : undefined,
                blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic) : undefined,
                blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic) : undefined,
                cholesterol_ldl: formData.cholesterol_ldl ? parseFloat(formData.cholesterol_ldl) : undefined,
                cholesterol_hdl: formData.cholesterol_hdl ? parseFloat(formData.cholesterol_hdl) : undefined,
                triglycerides: formData.triglycerides ? parseFloat(formData.triglycerides) : undefined,
                exercise_hours_per_week: formData.exercise_hours_per_week ? parseFloat(formData.exercise_hours_per_week) : undefined,
                sleep_hours_per_night: formData.sleep_hours_per_night ? parseFloat(formData.sleep_hours_per_night) : undefined,
                stress_level: formData.stress_level,
                smoking_status: formData.smoking_status,
            };

            // Submit health profile
            await submitHealthProfile(profileData);

            // Get AI diagnosis
            const diagnosisData = await getAIDiagnosis();
            setDiagnosis(diagnosisData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process health data');
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low': return 'text-emerald-600';
            case 'moderate': return 'text-blue-600';
            case 'high': return 'text-amber-600';
            case 'critical': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-6" hover>
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Heart size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Health Profile & AI Diagnosis</h3>
                        <p className="text-sm text-gray-500">Enter your health metrics for personalized analysis</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Vitals */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Basic Vitals</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                placeholder="Weight (kg)"
                                value={formData.weight_kg}
                                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="number"
                                placeholder="Height (cm)"
                                value={formData.height_cm}
                                onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Blood Pressure */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Blood Pressure</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                placeholder="Systolic (mmHg)"
                                value={formData.blood_pressure_systolic}
                                onChange={(e) => setFormData({ ...formData, blood_pressure_systolic: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="number"
                                placeholder="Diastolic (mmHg)"
                                value={formData.blood_pressure_diastolic}
                                onChange={(e) => setFormData({ ...formData, blood_pressure_diastolic: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Lab Values */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Lab Values</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                step="0.1"
                                placeholder="HbA1c (%)"
                                value={formData.hba1c}
                                onChange={(e) => setFormData({ ...formData, hba1c: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="number"
                                placeholder="LDL Cholesterol (mg/dL)"
                                value={formData.cholesterol_ldl}
                                onChange={(e) => setFormData({ ...formData, cholesterol_ldl: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="number"
                                placeholder="HDL Cholesterol (mg/dL)"
                                value={formData.cholesterol_hdl}
                                onChange={(e) => setFormData({ ...formData, cholesterol_hdl: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="number"
                                placeholder="Triglycerides (mg/dL)"
                                value={formData.triglycerides}
                                onChange={(e) => setFormData({ ...formData, triglycerides: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Lifestyle */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Lifestyle</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                step="0.5"
                                placeholder="Exercise (hrs/week)"
                                value={formData.exercise_hours_per_week}
                                onChange={(e) => setFormData({ ...formData, exercise_hours_per_week: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="number"
                                step="0.5"
                                placeholder="Sleep (hrs/night)"
                                value={formData.sleep_hours_per_night}
                                onChange={(e) => setFormData({ ...formData, sleep_hours_per_night: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <select
                                value={formData.stress_level}
                                onChange={(e) => setFormData({ ...formData, stress_level: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="low">Stress: Low</option>
                                <option value="medium">Stress: Medium</option>
                                <option value="high">Stress: High</option>
                            </select>
                            <select
                                value={formData.smoking_status}
                                onChange={(e) => setFormData({ ...formData, smoking_status: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="never">Never Smoked</option>
                                <option value="former">Former Smoker</option>
                                <option value="current">Current Smoker</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Heart className="w-5 h-5 mr-2" />
                                Get AI Diagnosis
                            </>
                        )}
                    </Button>
                </form>
            </Card>

            {/* Diagnosis Results */}
            {diagnosis && (
                <Card className="p-6" hover>
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">AI Health Analysis</h3>
                            <CheckCircle size={24} className="text-emerald-600" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Health Score</p>
                                <p className="text-3xl font-bold text-gray-900">{diagnosis.overall_health_score}</p>
                                <p className="text-xs text-gray-500">out of 100</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                                <p className={`text-2xl font-bold ${getRiskColor(diagnosis.risk_level)}`}>
                                    {diagnosis.risk_level.toUpperCase()}
                                </p>
                            </div>
                        </div>

                        {/* Concerns */}
                        {diagnosis.key_concerns && diagnosis.key_concerns.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">⚠️ Key Concerns:</p>
                                <ul className="space-y-1">
                                    {diagnosis.key_concerns.map((concern: string, idx: number) => (
                                        <li key={idx} className="text-sm text-amber-700 flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>{concern}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Positive Factors */}
                        {diagnosis.positive_factors && diagnosis.positive_factors.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">✅ Positive Factors:</p>
                                <ul className="space-y-1">
                                    {diagnosis.positive_factors.map((factor: string, idx: number) => (
                                        <li key={idx} className="text-sm text-emerald-700 flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>{factor}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Recommendations */}
                        {diagnosis.recommendations && diagnosis.recommendations.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">💡 Recommendations:</p>
                                <div className="space-y-2">
                                    {diagnosis.recommendations.slice(0, 5).map((rec: any, idx: number) => (
                                        <div key={idx} className="bg-blue-50 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-blue-900 mb-1">
                                                {rec.priority === 'critical' ? '🔴' : rec.priority === 'high' ? '🟠' : '🟡'} {rec.category.toUpperCase()}
                                            </p>
                                            <p className="text-sm text-blue-800">{rec.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Items */}
                        {diagnosis.action_items && diagnosis.action_items.length > 0 && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                <p className="text-sm font-semibold text-gray-900 mb-2">🎯 Next Steps:</p>
                                <ul className="space-y-1">
                                    {diagnosis.action_items.map((item: string, idx: number) => (
                                        <li key={idx} className="text-sm text-gray-800 flex items-start">
                                            <span className="mr-2">{idx + 1}.</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
