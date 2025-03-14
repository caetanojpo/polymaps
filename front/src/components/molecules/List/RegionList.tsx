import React from 'react';
import { Region } from '@/types';

interface RegionListProps {
    regions: Region[];
}

export function RegionList({ regions }: RegionListProps) {
    return (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-[1.6rem] font-semibold">My Regions</h2>
            </div>
            <div className="space-y-4  ">
                {regions.map((region) => (
                    <div
                        key={region._id}
                        className="p-4 bg-gray-50 rounded-md hover:bg-subprimary-100 transition"
                    >
                        <h3 className="font-medium text-[1.6rem]">{region.name}</h3>
                        <p className="text-[1rem] text-gray-500">
                            Created: {new Date(region.createdAt).toLocaleDateString()}
                        </p>
                        <div className="mt-2">
                            <h4 className="text-[1.2rem] font-semibold text-gray-600">Coordinates (Polygon):</h4>
                            <div className="mt-2 p-2 bg-gray-100 rounded-lg max-h-40 overflow-y-auto border border-gray-300 overflow-x-auto">
                                {region.location.coordinates.map((polygon, index) => (
                                    <div key={index} className="mb-2">
                                        <h5 className="text-[1.2rem] font-semibold text-gray-500">Latitude/Longitude:</h5>
                                        <ul className="text-[1.2rem] text-gray-700 space-y-1">
                                            {polygon.map((point, pIndex) => (
                                                <li key={pIndex} className="bg-gray-200 rounded px-2 py-1 inline-block">
                                                    📍 {point[0].toFixed(6)}, {point[1].toFixed(6)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
