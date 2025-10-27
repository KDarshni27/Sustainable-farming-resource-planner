import React, { useState } from 'react';
import { PlannerConfiguration, Field, CropType, GrowthStage } from '../types';

interface PlannerInputProps {
  onPlanRequest: (config: PlannerConfiguration) => void;
  isPlanning: boolean;
}

const PlannerInput: React.FC<PlannerInputProps> = ({ onPlanRequest, isPlanning }) => {
  const [numFields, setNumFields] = useState(3);
  const [water, setWater] = useState(20);
  const [fertilizer, setFertilizer] = useState(15);
  const [fieldCrops, setFieldCrops] = useState<CropType[]>(['WHEAT', 'CORN', 'SOY']);

  const handleFieldCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    if (count > 0 && count <= 10) {
      setNumFields(count);
      // Adjust the crops array to match the new count
      setFieldCrops(prev => {
        const newCrops = [...prev];
        if (count > prev.length) {
          for (let i = prev.length; i < count; i++) {
            newCrops.push('WHEAT'); // Default to WHEAT for new fields
          }
        }
        return newCrops.slice(0, count);
      });
    }
  };

  const handleCropChange = (index: number, crop: CropType) => {
    setFieldCrops(prev => {
      const newCrops = [...prev];
      newCrops[index] = crop;
      return newCrops;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields: Field[] = Array.from({ length: numFields }, (_, i) => ({
      id: i + 1,
      crop: fieldCrops[i],
      growthStage: GrowthStage.SEED,
      isWatered: false,
      isFertilized: false,
    }));

    onPlanRequest({
      fields,
      resources: { water, fertilizer },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="fields" className="block text-sm font-medium text-green-300">Number of Fields (1-10)</label>
          <input
            type="number"
            id="fields"
            value={numFields}
            onChange={handleFieldCountChange}
            min="1"
            max="10"
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
            disabled={isPlanning}
          />
        </div>
        <div>
          <label htmlFor="water" className="block text-sm font-medium text-green-300">Available Water Units</label>
          <input
            type="number"
            id="water"
            value={water}
            onChange={(e) => setWater(parseInt(e.target.value))}
            min="0"
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
            disabled={isPlanning}
          />
        </div>
        <div>
          <label htmlFor="fertilizer" className="block text-sm font-medium text-green-300">Available Fertilizer Units</label>
          <input
            type="number"
            id="fertilizer"
            value={fertilizer}
            onChange={(e) => setFertilizer(parseInt(e.target.value))}
            min="0"
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
            disabled={isPlanning}
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-green-300 mb-2">Crop Assignment</h3>
        <div className="flex flex-row flex-wrap gap-4">
          {Array.from({ length: numFields }).map((_, i) => (
            <div key={i} className="bg-slate-700/50 p-3 rounded-lg flex-1 min-w-[150px]">
              <label htmlFor={`crop-${i}`} className="block text-sm font-medium text-gray-300">Field {i + 1}</label>
              <select
                id={`crop-${i}`}
                value={fieldCrops[i]}
                onChange={(e) => handleCropChange(i, e.target.value as CropType)}
                className="mt-1 block w-full bg-slate-600 border border-slate-500 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                disabled={isPlanning}
              >
                <option value="WHEAT">Wheat</option>
                <option value="CORN">Corn</option>
                <option value="SOY">Soy</option>
                <option value="POTATO">Potato</option>
                <option value="CARROT">Carrot</option>
                <option value="TOMATO">Tomato</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
          disabled={isPlanning}
        >
          {isPlanning ? 'Planning...' : 'Generate Plan'}
        </button>
      </div>
    </form>
  );
};

export default PlannerInput;