import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, PieChart, Pie } from 'recharts';
import { 
  Sprout, Activity, Wind, Droplets, Thermometer, 
  ArrowRight, RefreshCw, AlertTriangle, CheckCircle, 
  Users, BookOpen, BarChart2, ShieldAlert, Tractor, Microscope, Building2
} from 'lucide-react';

// --- 模拟数据与逻辑 ---
const mockPredict = (inputs) => {
  const { rainfall, humidity } = inputs;
  // 简单逻辑模拟
  if (rainfall > 180 && humidity > 70) {
    return {
      crop: 'Rice',
      confidence: 98.5,
      desc: 'High water requirement, suitable for wetland conditions.',
      shap: [
        { name: 'Rainfall', value: 0.52, impact: 'positive' },
        { name: 'Humidity', value: 0.28, impact: 'positive' },
        { name: 'Nitrogen', value: 0.12, impact: 'positive' },
        { name: 'Temp', value: 0.05, impact: 'positive' },
        { name: 'pH', value: -0.02, impact: 'negative' },
      ],
      counterfactual: {
        target: 'Mothbeans',
        changeMetric: 'Rainfall',
        changeValue: '70mm',
        direction: 'decrease',
        risk: 'High Water Dependency'
      },
      policyRisk: 'Flood Prone Region'
    };
  } else if (rainfall < 70) {
    return {
      crop: 'Mothbeans',
      confidence: 94.2,
      desc: 'Extremely drought-resistant, suitable for arid zones.',
      shap: [
        { name: 'Rainfall', value: 0.45, impact: 'positive' },
        { name: 'Humidity', value: -0.15, impact: 'negative' },
        { name: 'Temp', value: 0.20, impact: 'positive' },
        { name: 'Nitrogen', value: -0.05, impact: 'negative' },
        { name: 'pH', value: 0.08, impact: 'positive' },
      ],
      counterfactual: {
        target: 'Coffee',
        changeMetric: 'Rainfall',
        changeValue: '150mm',
        direction: 'increase',
        risk: 'Drought Resilient'
      },
      policyRisk: 'Drought Vulnerable Zone'
    };
  } else {
    return {
      crop: 'Coffee',
      confidence: 89.7,
      desc: 'Requires moderate rainfall and tropical highland climate.',
      shap: [
        { name: 'pH', value: 0.35, impact: 'positive' },
        { name: 'Temp', value: 0.25, impact: 'positive' },
        { name: 'Rainfall', value: 0.15, impact: 'positive' },
        { name: 'Humidity', value: 0.10, impact: 'positive' },
        { name: 'Potassium', value: -0.10, impact: 'negative' },
      ],
      counterfactual: {
        target: 'Rice',
        changeMetric: 'Rainfall',
        changeValue: '200mm',
        direction: 'increase',
        risk: 'Moderate'
      },
      policyRisk: 'Stable Production Zone'
    };
  }
};

const CropRecommenderAppV3 = () => {
  // 角色状态: 'farmer', 'agronomist', 'policymaker'
  const [role, setRole] = useState('farmer'); 
  
  const [inputs, setInputs] = useState({
    nitrogen: 90, phosphorus: 42, potassium: 43,
    temperature: 20.8, humidity: 82.0, ph: 6.5, rainfall: 202.9
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // 切换角色时，若已有结果，自动重新适配文案
  useEffect(() => {
    if (hasAnalyzed) {
        // Just a visual refresh effect if needed
    }
  }, [role, hasAnalyzed]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    if (hasAnalyzed) setHasAnalyzed(false);
  };

  const handleAnalyze = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(mockPredict(inputs));
      setLoading(false);
      setHasAnalyzed(true);
    }, 600);
  };

  // 角色配置
  const roleConfig = {
    farmer: {
      color: 'emerald',
      icon: Tractor,
      title: 'Farmer View',
      subtitle: 'Field Operations & Planning',
      inputTitle: 'My Field Conditions',
      resultLabel: 'Recommended for You',
      shapTitle: 'Key Influencing Factors',
      cfTitle: 'What-If Analysis (Risk Check)'
    },
    agronomist: {
      color: 'purple',
      icon: Microscope,
      title: 'Agronomist View',
      subtitle: 'Model Validation & Diagnostics',
      inputTitle: 'Sample Parameters (Test)',
      resultLabel: 'Model Prediction',
      shapTitle: 'Feature Importance (SHAP Global/Local)',
      cfTitle: 'Sensitivity Analysis (Counterfactuals)'
    },
    policymaker: {
      color: 'blue',
      icon: Building2,
      title: 'Policymaker View',
      subtitle: 'Regional Strategy & Food Security',
      inputTitle: 'Regional Climate Simulation',
      resultLabel: 'Dominant Crop Suitability',
      shapTitle: 'Regional Risk Drivers',
      cfTitle: 'Climate Resilience Test'
    }
  };

  const theme = roleConfig[role];

  return (
    <div className={`min-h-screen bg-slate-50 font-sans text-slate-800`}>
      
      {/* --- 顶部：角色切换栏 (Top Tabs) --- */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex justify-center md:justify-start overflow-x-auto">
             <button 
               onClick={() => setRole('farmer')}
               className={`flex items-center px-6 py-4 border-b-2 transition-all font-semibold ${role === 'farmer' ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               <Tractor size={18} className="mr-2" /> Farmer
             </button>
             <button 
               onClick={() => setRole('agronomist')}
               className={`flex items-center px-6 py-4 border-b-2 transition-all font-semibold ${role === 'agronomist' ? 'border-purple-500 text-purple-700 bg-purple-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               <Microscope size={18} className="mr-2" /> Agronomist
             </button>
             <button 
               onClick={() => setRole('policymaker')}
               className={`flex items-center px-6 py-4 border-b-2 transition-all font-semibold ${role === 'policymaker' ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               <Building2 size={18} className="mr-2" /> Policy Maker
             </button>
          </div>
        </div>
      </div>

      {/* --- 主标题栏 --- */}
      <header className={`bg-${theme.color}-800 text-white p-6 shadow-lg transition-colors duration-500`}>
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
               <theme.icon size={28} />
               <h1 className="text-2xl font-bold">{theme.title}</h1>
            </div>
            <p className={`text-${theme.color}-100 opacity-90 text-sm`}>{theme.subtitle}</p>
          </div>
          <div className="hidden md:block text-right text-xs opacity-80">
            <p>System v3.0</p>
            <p>Role-Based UX Enabled</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- 左侧：输入面板 (通用但标题不同) --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className={`font-bold text-${theme.color}-700 flex items-center mb-4`}>
              <Activity className="mr-2" size={18} />
              {theme.inputTitle}
            </h2>
            
            {/* 输入控件 - 简化显示 */}
            <div className="space-y-4">
               {/* 气候 */}
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2">Climate</label>
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="text-xs text-slate-500">Rainfall (mm)</label>
                       <input type="number" name="rainfall" value={inputs.rainfall} onChange={handleInputChange} className="w-full p-2 border rounded text-sm" />
                     </div>
                     <div>
                       <label className="text-xs text-slate-500">Humidity (%)</label>
                       <input type="number" name="humidity" value={inputs.humidity} onChange={handleInputChange} className="w-full p-2 border rounded text-sm" />
                     </div>
                  </div>
               </div>
               {/* 土壤 */}
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2">Soil (N-P-K)</label>
                  <div className="grid grid-cols-3 gap-2">
                     <input type="number" name="nitrogen" value={inputs.nitrogen} onChange={handleInputChange} className="w-full p-2 border rounded text-center text-sm" placeholder="N"/>
                     <input type="number" name="phosphorus" value={inputs.phosphorus} onChange={handleInputChange} className="w-full p-2 border rounded text-center text-sm" placeholder="P"/>
                     <input type="number" name="potassium" value={inputs.potassium} onChange={handleInputChange} className="w-full p-2 border rounded text-center text-sm" placeholder="K"/>
                  </div>
               </div>

               <button 
                onClick={handleAnalyze}
                disabled={loading || hasAnalyzed}
                className={`w-full py-3 rounded-lg font-bold shadow transition-all flex justify-center items-center 
                  ${loading ? 'bg-slate-300 text-slate-500' : hasAnalyzed ? 'bg-slate-100 text-slate-400 border' : `bg-${theme.color}-600 hover:bg-${theme.color}-700 text-white`}`}
              >
                {loading ? 'Processing...' : hasAnalyzed ? 'Analysis Ready' : 'Analyze Data'}
              </button>
              
              {hasAnalyzed && (
                 <p className="text-center text-xs text-slate-400 cursor-pointer underline" onClick={() => setHasAnalyzed(false)}>
                   Change inputs to re-run
                 </p>
              )}
            </div>
          </div>
        </div>

        {/* --- 右侧：结果与解释面板 --- */}
        <div className="lg:col-span-8 space-y-6">
           
           {!result && !loading && (
             <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
               <BookOpen size={32} className="mb-2 opacity-50"/>
               <p>Awaiting Input Data...</p>
             </div>
           )}

           {loading && (
             <div className="h-64 flex items-center justify-center bg-white rounded-xl shadow-sm">
                <div className="flex flex-col items-center">
                   <RefreshCw className={`animate-spin text-${theme.color}-500 mb-2`} size={32} />
                   <p className="text-sm text-slate-500">Running AI Model Inference...</p>
                </div>
             </div>
           )}

           {result && !loading && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                
                {/* 1. 主要结果卡片 (根据角色变化内容) */}
                <div className={`bg-white rounded-xl shadow-md border-l-8 border-${theme.color}-500 p-6 flex flex-col md:flex-row justify-between items-center`}>
                   <div>
                      <span className={`text-xs font-bold text-${theme.color}-600 uppercase tracking-wide bg-${theme.color}-50 px-2 py-1 rounded`}>
                        {theme.resultLabel}
                      </span>
                      <h2 className="text-4xl font-extrabold text-slate-800 mt-2">{result.crop}</h2>
                      <p className="text-slate-500 text-sm mt-1 max-w-md">{result.desc}</p>
                   </div>
                   <div className="mt-4 md:mt-0 text-right">
                      {role === 'farmer' ? (
                         <div className="flex items-center text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                            <CheckCircle size={20} className="mr-2" />
                            <span className="font-bold">High Suitability</span>
                         </div>
                      ) : (
                         <div>
                            <span className="block text-xs text-slate-400 uppercase">Confidence Score</span>
                            <span className={`text-3xl font-bold text-${theme.color}-600`}>{result.confidence}%</span>
                         </div>
                      )}
                   </div>
                </div>

                {/* 2. 解释性内容 (完全基于角色定制) */}
                
                {/* --- FARMER VIEW: 简单直接，强调行动 --- */}
                {role === 'farmer' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Simplified "Why" */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                       <h3 className="font-bold text-slate-700 mb-3 flex items-center">
                         <LeafIcon /> Why this recommendation?
                       </h3>
                       <p className="text-sm text-slate-600 mb-4">
                         Based on your field data, <strong>Rainfall ({inputs.rainfall}mm)</strong> and <strong>Humidity ({inputs.humidity}%)</strong> are the main reasons for recommending {result.crop}.
                       </p>
                       <div className="space-y-2">
                          <div className="flex items-center text-sm">
                             <div className="w-24 font-semibold text-slate-500">Rainfall</div>
                             <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full" style={{width: '90%'}}></div>
                             </div>
                             <div className="ml-2 text-emerald-600 font-bold">Good</div>
                          </div>
                          <div className="flex items-center text-sm">
                             <div className="w-24 font-semibold text-slate-500">Soil pH</div>
                             <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full" style={{width: '75%'}}></div>
                             </div>
                             <div className="ml-2 text-emerald-600 font-bold">OK</div>
                          </div>
                       </div>
                    </div>

                    {/* Actionable Counterfactual */}
                    <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                       <h3 className="font-bold text-amber-800 mb-3 flex items-center">
                         <AlertTriangle size={18} className="mr-2"/> Warning: Weather Change
                       </h3>
                       <p className="text-sm text-amber-900 mb-4">
                         "What should I do if the rain stops?"
                       </p>
                       <div className="bg-white p-3 rounded border border-amber-100 shadow-sm text-sm">
                          <p className="mb-2">
                            If rainfall drops to <strong>{result.counterfactual.changeValue}</strong>, you should switch to:
                          </p>
                          <div className="font-bold text-lg text-amber-700 flex items-center">
                             <ArrowRight size={16} className="mr-2"/> {result.counterfactual.target}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Reason: Better drought resistance.</p>
                       </div>
                    </div>
                  </div>
                )}

                {/* --- AGRONOMIST VIEW: 详细，强调验证 --- */}
                {role === 'agronomist' && (
                  <div className="space-y-6">
                    {/* SHAP Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                       <h3 className="font-bold text-purple-800 mb-4 flex items-center text-sm uppercase">
                         <BarChart2 size={18} className="mr-2"/> Model Logic Verification (SHAP)
                       </h3>
                       <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={result.shap} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={80} tick={{fontSize: 12}} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <ReferenceLine x={0} stroke="#94a3b8" />
                            <Bar dataKey="value" barSize={20}>
                              {result.shap.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#8b5cf6' : '#ef4444'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                       </div>
                       <p className="text-xs text-slate-500 mt-2">
                         *Blue bars indicate positive contribution towards {result.crop}. Red indicates negative contribution. The model correctly identifies physical constraints (Rainfall/Temp) as primary drivers.
                       </p>
                    </div>

                    {/* Technical Counterfactual */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                       <h3 className="font-bold text-slate-700 mb-2 text-sm">Sensitivity Analysis (Decision Boundary)</h3>
                       <code className="block bg-slate-800 text-green-400 p-3 rounded text-xs font-mono">
                         Boundary_Detection:<br/>
                         Current_Class: {result.crop}<br/>
                         Perturbation: {result.counterfactual.changeMetric} {result.counterfactual.direction} {`->`} {result.counterfactual.changeValue}<br/>
                         Flip_To_Class: {result.counterfactual.target}
                       </code>
                    </div>
                  </div>
                )}

                {/* --- POLICYMAKER VIEW: 宏观，强调风险 --- */}
                {role === 'policymaker' && (
                  <div className="space-y-6">
                     <div className="grid md:grid-cols-2 gap-6">
                        {/* Risk Card */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                           <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                             <ShieldAlert size={18} className="mr-2"/> Regional Risk Assessment
                           </h3>
                           <p className="text-sm text-blue-900 mb-4">
                             Current simulation indicates this region is classified as:
                           </p>
                           <div className="text-2xl font-bold text-blue-700 mb-2">
                             {result.policyRisk}
                           </div>
                           <p className="text-xs text-slate-600">
                             High dependency on consistent rainfall makes this monoculture strategy risky for long-term food security.
                           </p>
                        </div>

                        {/* Strategic Recommendation */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                           <h3 className="font-bold text-slate-700 mb-2">Strategic Recommendation</h3>
                           <ul className="space-y-3 text-sm text-slate-600">
                              <li className="flex items-start">
                                 <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                                 <span>Subsidize <strong>{result.counterfactual.target}</strong> seeds as a drought buffer crop.</span>
                              </li>
                              <li className="flex items-start">
                                 <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                                 <span>Invest in irrigation infrastructure if aiming to maintain {result.crop} production.</span>
                              </li>
                           </ul>
                        </div>
                     </div>
                  </div>
                )}

             </div>
           )}
        </div>
      </main>
    </div>
  );
};

// Helper Icon
const LeafIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-emerald-600"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
)

export default CropRecommenderAppV3;