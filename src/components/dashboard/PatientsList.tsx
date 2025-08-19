
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Download } from 'lucide-react';

const mockPatients = [
  { id: '1', name: 'Rohan Sharma', age: 34, lastVisit: '2024-05-10', ongoingTreatments: 'Lower Back Pain' },
  { id: '2', name: 'Priya Singh', age: 28, lastVisit: '2024-05-12', ongoingTreatments: 'Knee Physiotherapy' },
  { id: '3', name: 'Amit Patel', age: 45, lastVisit: '2024-04-28', ongoingTreatments: 'Shoulder Impingement' },
  { id: '4', name: 'Sunita Devi', age: 62, lastVisit: '2024-05-05', ongoingTreatments: 'Arthritis Management' },
];

export function PatientsList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Patients</CardTitle>
          <CardDescription>Manage your patient records.</CardDescription>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
           <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto"
          />
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Ongoing Treatments</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map(patient => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.ongoingTreatments}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
