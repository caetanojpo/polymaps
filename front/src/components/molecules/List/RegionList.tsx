import React from 'react';
import {Plus} from 'lucide-react';
import {Region} from '@/types';

interface RegionListProps {
    regions: Region[];
    onAddRegion: () => void;
}

export function RegionList({regions, onAddRegion}: RegionListProps) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">My Regions</h2>
                <button
                    onClick={onAddRegion}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <Plus className="w-4 h-4 mr-1"/>
                    Add Region
                </button>
            </div>
            <div className="space-y-2">
                {regions.map((region) => (
                    <div
                        key={region.id}
                        className="p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                    >
                        <h3 className="font-medium">{region.name}</h3>
                        <p className="text-sm text-gray-500">
                            Created: {new Date(region.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}