import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAllUsers, deleteUser } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminUsers() {
  const [users, setUsers] = useState(getAllUsers());
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (userId: string, email: string) => {
    if (email === 'admin@stylesense.com') {
      toast.error('Cannot delete default admin');
      return;
    }
    deleteUser(userId);
    setUsers(getAllUsers());
    toast.success('User removed');
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-display font-bold mb-1">User Management</h1>
      <p className="text-muted-foreground text-sm mb-6">View and manage all registered users</p>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {['User', 'Email', 'Role', 'Gender', 'Body Type', 'Styles', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">{u.avatarInitial}</div>
                      <span className="font-medium">{u.name || '—'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                      u.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-4 capitalize text-muted-foreground">{u.gender}</td>
                  <td className="py-3 px-4 capitalize text-muted-foreground">{u.bodyType}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {u.preferredStyles.slice(0, 2).map(s => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-sm capitalize">{s}</span>
                      ))}
                      {u.preferredStyles.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">+{u.preferredStyles.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(u.id, u.email)}
                      disabled={u.email === 'admin@stylesense.com'}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
