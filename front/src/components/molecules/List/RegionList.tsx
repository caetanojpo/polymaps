import React from 'react';
import {Plus} from 'lucide-react';
import {Region} from '@/types';

interface RegionListProps {
    regions: Region[];
}

export function RegionList({regions}: RegionListProps) {
    return (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-[1.6rem] font-semibold">My Regions</h2>
            </div>
            <div className="space-y-2 overflow-y-scroll">
                {regions.map((region) => (
                    <div
                        key={region._id}
                        className="p-3 bg-gray-50 rounded-md hover:bg-subprimary-100 "
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