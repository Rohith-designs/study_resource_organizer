
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useSyllabusTopics } from '@/hooks/useSyllabusTopics';
import { useSubjects } from '@/hooks/useSubjects';
import { StudyTimer } from './StudyTimer';

export const Dashboard = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: syllabusTopics = [] } = useSyllabusTopics();
  const { data: subjects = [] } = useSubjects();

  const totalTopics = syllabusTopics.length;
  const completedTopics = syllabusTopics.filter(topic => topic.completed).length;
  const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  const upcomingExams = [
    { name: 'RRB JE IT', date: '2024-05-15', daysLeft: 120 },
    { name: 'UPSC Prelims', date: '2024-06-16', daysLeft: 152 }
  ];

  const recentActivity = [
    { action: 'Completed', item: 'Data Structures - Trees', time: '2 hours ago' },
    { action: 'Added', item: 'Database Systems Notes', time: '4 hours ago' },
    { action: 'Scheduled', item: 'Mock Test Session', time: '1 day ago' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name || user?.email}!
        </h2>
        <p className="text-gray-600 mt-1">Here's your RRB JE-IT preparation progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Topics</p>
                <p className="text-3xl font-bold">{totalTopics}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedTopics}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-3xl font-bold text-blue-600">{Math.round(progressPercentage)}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Target Date</p>
                <p className="text-sm font-semibold">{profile?.target_date || 'Not set'}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Timer */}
        <div className="lg:col-span-1">
          <StudyTimer />
        </div>

        {/* Progress Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Syllabus Completion</span>
                <span className="text-sm text-gray-500">{completedTopics}/{totalTopics} topics</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {subjects.slice(0, 4).map((subject) => {
                  const subjectTopics = syllabusTopics.filter(topic => topic.subject_id === subject.id);
                  const subjectCompleted = subjectTopics.filter(topic => topic.completed).length;
                  const subjectProgress = subjectTopics.length > 0 ? (subjectCompleted / subjectTopics.length) * 100 : 0;
                  
                  return (
                    <div key={subject.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-sm text-gray-900">{subject.name}</h4>
                      <div className="mt-2">
                        <Progress value={subjectProgress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{Math.round(subjectProgress)}% complete</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Upcoming Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExams.map((exam, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                    <p className="text-sm text-gray-600">{exam.date}</p>
                  </div>
                  <Badge variant="destructive">
                    {exam.daysLeft} days left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span> {activity.item}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
