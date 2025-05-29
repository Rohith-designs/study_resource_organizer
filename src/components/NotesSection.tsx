
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, BookOpen, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useNotes, useCreateNote } from '@/hooks/useNotes';
import { useSubjects } from '@/hooks/useSubjects';
import { useToast } from '@/hooks/use-toast';

export const NotesSection = () => {
  const { data: notes = [] } = useNotes();
  const { data: subjects = [] } = useSubjects();
  const createNote = useCreateNote();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showQuickNote, setShowQuickNote] = useState(false);

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) return;
    
    try {
      await createNote.mutateAsync({
        title: newNoteTitle,
        content: newNoteContent,
        tags: []
      });
      
      setNewNoteTitle('');
      setNewNoteContent('');
      setShowQuickNote(false);
      
      toast({
        title: "Note created!",
        description: "Your note has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const subjectOptions = ['all', ...subjects.map(s => s.name)];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesSubject = selectedSubject === 'all' || 
                          (note.subjects && note.subjects.name === selectedSubject);
    return matchesSearch && matchesSubject;
  });

  const totalWords = notes.reduce((sum, note) => sum + (note.word_count || 0), 0);
  const uniqueSubjects = new Set(notes.map(note => note.subjects?.name).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Notes</h2>
        <p className="text-gray-600 mt-1">Create, organize, and review your study notes.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold">{notes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Words</p>
                <p className="text-2xl font-bold">{totalWords}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-2xl font-bold">{uniqueSubjects}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes, content, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {subjectOptions.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
              <Button onClick={() => setShowQuickNote(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{note.title}</CardTitle>
                {note.subjects && (
                  <Badge variant="outline" className="w-fit">
                    {note.subjects.name}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                {note.content && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {note.content}
                  </p>
                )}
                
                <div className="space-y-3">
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                    <span>{note.word_count || 0} words</span>
                    <span>Modified: {new Date(note.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No notes found</p>
            <Button onClick={() => setShowQuickNote(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Note
            </Button>
          </div>
        )}
      </div>

      {/* Quick Note Creation */}
      {showQuickNote && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Note
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input 
                placeholder="Note title..." 
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
              <textarea 
                placeholder="Start writing your note here..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md resize-none h-32"
              />
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {newNoteContent.split(' ').filter(word => word.length > 0).length} words
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowQuickNote(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNote} disabled={!newNoteTitle.trim()}>
                    Save Note
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
