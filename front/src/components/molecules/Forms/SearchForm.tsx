"use client"
import React, {useState} from 'react';
import {Search} from 'lucide-react';
import {Card} from '@/components/atoms/Card/Card';
import {Field} from '@/components/atoms/Fields/Field';
import {Button} from '@/components/atoms/Buttons/Button';
import {Region} from '@/types';

interface SearchFormProps {
    onSearch: (type: 'contains' | 'near', coordinates: { latitude: number; longitude: number }) => Promise<void>;
    regions: Region[];
}

export function SearchForm({onSearch, regions}: SearchFormProps) {
    const [searchType, setSearchType] = useState<'contains' | 'near'>('contains');
    const [coordinates, setCoordinates] = useState({latitude: 0, longitude: 0});

    return (
        <Card>
            <h2 className="text-[1.6rem] font-semibold mb-4">Search Regions</h2>
            <div className="space-y-4">
                <div className="text-[1.2rem] flex space-x-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded-md ${
                            searchType === 'contains'
                                ? 'bg-subprimary-700 text-white'
                                : 'bg-gray-100 text-gray-700 cursor-pointer'
                        }`}
                        onClick={() => setSearchType('contains')}
                    >
                        Contains Point
                    </button>
                    <button
                        className={`text-[1.2rem] px-4 py-2 rounded-md ${
                            searchType === 'near'
                                ? 'bg-subprimary-700 text-white'
                                : 'bg-gray-100 text-gray-700 cursor-pointer'
                        }`}
                        onClick={() => setSearchType('near')}
                    >
                        Near Point
                    </button>
                </div>

                <Field
                    label="Latitude"
                    type="number"
                    step="any"
                    value={coordinates.latitude}
                    onChange={(e) => setCoordinates({...coordinates, latitude: parseFloat(e.target.value)})}
                />
                <Field
                    label="Longitude"
                    type="number"
                    step="any"
                    value={coordinates.longitude}
                    onChange={(e) => setCoordinates({...coordinates, longitude: parseFloat(e.target.value)})}
                />
                <Button
                    variant="primary"
                    icon={Search}
                    onClick={() => onSearch(searchType, coordinates)}
                    className="w-full"
                >
                    Search {searchType === 'contains' ? 'Containing' : 'Near'} Point
                </Button>
            </div>

            {regions.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-md font-semibold mb-3">Search Results</h3>
                    <div className="space-y-2">
                        {regions.map((region) => (
                            <div
                                key={region.id}
                                className="p-3 bg-gray-50 rounded-md"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium">{region.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            Owner: {region.owner.name}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                    {new Date(region.createdAt).toLocaleDateString()}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}