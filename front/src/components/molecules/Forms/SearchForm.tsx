"use client"
import React, {useState} from 'react';
import {Search} from 'lucide-react';
import {Card} from '@/components/atoms/Card/Card';
import {Field} from '@/components/atoms/Fields/Field';
import {Button} from '@/components/atoms/Buttons/Button';
import {Region} from '@/types';
import {SearchParams} from "@/types/searchParams";

interface SearchFormProps {
    onSearch: (params: SearchParams) => Promise<void>;
    search: Region[];
}

export function SearchForm({onSearch, search}: SearchFormProps) {
    const [searchType, setSearchType] = useState<'contains' | 'near'>('contains');
    const [coordinates, setCoordinates] = useState({latitude: 0, longitude: 0});
    const [maxDistance, setMaxDistance] = useState<number>(10000000);
    const [fromOwner, setFromOwner] = useState<boolean>(false);

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

                {searchType === 'near' && (
                    <>
                        <Field
                            label="Max Distance (meters)"
                            type="number"
                            step="any"
                            value={maxDistance}
                            min="0"
                            onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={fromOwner}
                                onChange={(e) => setFromOwner(e.target.checked)}
                                className="h-6 w-6 r"
                                id="fromOwnerCheckbox"
                            />
                            <label htmlFor="fromOwnerCheckbox" className="text-[1.2rem] cursor-pointer">
                                From Owner
                            </label>
                        </div>
                    </>
                )}

                <Button
                    variant="primary"
                    icon={Search}
                    onClick={() => {
                        if (searchType === 'near') {
                            onSearch({
                                type: 'near',
                                coordinates,
                                options: {maxDistance, fromOwner}
                            });
                        } else {
                            onSearch({
                                type: 'contains',
                                coordinates
                            });
                        }
                    }}
                    className="w-full"
                >
                    Search {searchType === 'contains' ? 'Containing' : 'Near'} Point
                </Button>
            </div>

            {search.length > 0 && (<>
                    <h3 className="mt-6 text-[1.4rem] font-semibold mb-3">Search Results</h3>
                    <div className="max-h-[290px] overflow-y-scroll">
                        <div className="space-y-2">
                            {search.map((region) => (
                                <div
                                    key={region._id}
                                    className="p-3 bg-gray-50 rounded-md hover:bg-subprimary-100"
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
                </>
            )}
        </Card>
    );
}