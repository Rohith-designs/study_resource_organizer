
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Video, ExternalLink, Search, Filter, Plus } from 'lucide-react';
import { useState } from 'react';
import { useStudyResources, useCreateStudyResource } from '@/hooks/useStudyResources';
import { useSubjects } from '@/hooks/useSubjects';
import { useToast } from '@/hooks/use-toast';

export const ResourceManager = () => {
  const { data: resources = [] } = useStudyResources();
  const { data: subjects = [] } = useSubjects();
  const createStudyResource = useCreateStudyResource();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');

  const handleAddResource = async () => {
    if (!newResourceName.trim()) return;
    
    try {
      await createStudyResource.mutateAsync({
        name: newResourceName,
        type: newResourceUrl ? 'link' : 'document',
        external_url: newResourceUrl || undefined,
        tags: []
      });
      
      setNewResourceName('');
      setNewResourceUrl('');
      setShowAddResource(false);
      
      toast({
        title: "Resource added!",
        description: "New study resource has been added to your collection.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add resource. Please try again.",
        variant: "destructive",
      });
    }
  };

  const subjectOptions = ['all', ...subjects.map(s => s.name)];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-blue-500" />;
      case 'link':
        return <ExternalLink className="h-8 w-8 text-green-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesSubject = selectedSubject === 'all' || 
                          (resource.subjects && resource.subjects.name === selectedSubject);
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Resource Manager</h2>
        <p className="text-gray-600 mt-1">Upload, organize, and access your study materials.</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Add New Resource
            </span>
            <Button size="sm" onClick={() => setShowAddResource(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAddResource ? (
            <div className="space-y-4">
              <Input
                placeholder="Resource name..."
                value={newResourceName}
                onChange={(e) => setNewResourceName(e.target.value)}
              />
              <Input
                placeholder="External URL (optional)..."
                value={newResourceUrl}
                onChange={(e) => setNewResourceUrl(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddResource} disabled={!newResourceName.trim()}>
                  Add Resource
                </Button>
                <Button variant="outline" onClick={() => setShowAddResource(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer" onClick={() => setShowAddResource(true)}>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Add study resources</p>
              <p className="text-sm text-gray-500 mb-4">Add links, documents, and other study materials</p>
              <Button>Add Resource</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {getFileIcon(resource.type)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-2">{resource.name}</h3>
                    <div className="space-y-2">
                      {resource.subjects && (
                        <Badge variant="outline">{resource.subjects.name}</Badge>
                      )}
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 space-y-1">
                        {resource.size_mb && <p>Size: {resource.size_mb} MB</p>}
                        {resource.duration_minutes && <p>Duration: {resource.duration_minutes} min</p>}
                        <p>Added: {new Date(resource.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (resource.external_url) {
                        window.open(resource.external_url, '_blank');
                      }
                    }}
                  >
                    {resource.type === 'link' ? 'Open Link' : 'View Resource'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No study resources found</p>
            <Button onClick={() => setShowAddResource(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Resource
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
