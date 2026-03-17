'use client';

import { useState, useEffect } from 'react';
import { Users, Loader2, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatDate } from '@/utils/formatters';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  created_at: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('cyfer_token');
        const res = await fetch('/api/auth', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success && json.data) {
          // For now show current user; full user list requires a dedicated endpoint
          setUsers([json.data]);
        }
      } catch (err) { console.error('Failed to fetch users:', err); }
      finally { setLoading(false); }
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Users className="text-accent" /> User Management
      </h1>

      <Card className="mb-6 bg-amber-50 border-amber-200">
        <div className="flex items-center gap-2 text-sm text-amber-800">
          <Shield size={16} />
          <span>Only Super Admins can manage users. Contact your system administrator to add or modify user accounts.</span>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-muted" /></div>
      ) : users.length === 0 ? (
        <Card className="text-center py-12"><p className="text-muted">No users found.</p></Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-sm">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'super_admin' ? 'accent' : 'info'}>
                    {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted">{user.department}</TableCell>
                <TableCell className="text-sm text-muted">{formatDate(user.created_at)}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
