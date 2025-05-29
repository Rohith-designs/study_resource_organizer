
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Clock, Plus } from 'lucide-react';
import { useSyllabusTopics, useUpdateTopicCompletion } from '@/hooks/useSyllabusTopics';
import { useSubjects } from '@/hooks/useSubjects';
import { useToast } from '@/hooks/use-toast';

export const SyllabusTracker = () => {
  const { data: subjects = [] } = useSubjects();
  const { data: syllabusTopics = [] } = useSyllabusTopics();
  const updateTopicCompletion = useUpdateTopicCompletion();
  const { toast } = useToast();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTopicToggle = async (topicId: string, currentStatus: boolean) => {
    try {
      await updateTopicCompletion.mutateAsync({
        topicId,
        completed: !currentStatus
      });
      
      toast({
        title: !currentStatus ? "Topic completed!" : "Topic marked incomplete",
        description: !currentStatus ? "Great progress on your RRB JE-IT preparation!" : "Topic status updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update topic status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Group topics by subject
  const subjectsWithTopics = subjects.map(subject => {
    const subjectTopics = syllabusTopics.filter(topic => topic.subject_id === subject.id);
    const completedTopics = subjectTopics.filter(topic => topic.completed).length;
    
    return {
      ...subject,
      topics: subjectTopics,
      completedTopics,
      totalTopics: subjectTopics.length
    };
  });

  if (subjects.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Syllabus Tracker</h2>
          <p className="text-gray-600 mt-1">Loading RRB JE-IT syllabus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">RRB JE-IT Syllabus Tracker</h2>
        <p className="text-gray-600 mt-1">Track your progress across all RRB JE-IT subjects and topics.</p>
      </div>

      {syllabusTopics.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Topics Added Yet</h3>
            <p className="text-gray-600 mb-4">
              Start building your RRB JE-IT study plan by adding topics for each subject.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Topic
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {subjectsWithTopics.map((subject) => (
          <Card key={subject.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  {subject.name}
                </span>
                <Badge variant="outline">
                  {subject.completedTopics}/{subject.totalTopics}
                </Badge>
              </CardTitle>
              {subject.totalTopics > 0 && (
                <div className="space-y-2">
                  <Progress 
                    value={(subject.completedTopics / subject.totalTopics) * 100} 
                    className="h-2"
                  />
                  <p className="text-sm text-gray-500">
                    {Math.round((subject.completedTopics / subject.totalTopics) * 100)}% Complete
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {subject.topics.length > 0 ? (
                <div className="space-y-3">
                  {subject.topics.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={topic.completed}
                          onCheckedChange={() => handleTopicToggle(topic.id, topic.completed)}
                          className="data-[state=checked]:bg-green-600"
                        />
                        <span className={`text-sm ${topic.completed ? 'line-through text-gray-500' : ''}`}>
                          {topic.topic_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={getPriorityColor(topic.priority)}>
                          {topic.priority}
                        </Badge>
                        {topic.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-2">No topics added for this subject</p>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Topics
                  </Button>
                </div>
              )}
              
              <Button variant="outline" className="w-full mt-4">
                <Clock className="h-4 w-4 mr-2" />
                Manage Topics
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
