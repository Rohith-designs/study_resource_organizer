
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Plus, Target } from 'lucide-react';
import { useState } from 'react';
import { useStudySessions, useCreateStudySession } from '@/hooks/useStudySessions';
import { useSubjects } from '@/hooks/useSubjects';
import { useToast } from '@/hooks/use-toast';

export const StudyCalendar = () => {
  const { data: studySessions = [] } = useStudySessions();
  const { data: subjects = [] } = useSubjects();
  const createStudySession = useCreateStudySession();
  const { toast } = useToast();
  const [currentDate] = useState(new Date());
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [showAddSession, setShowAddSession] = useState(false);

  const handleAddSession = async () => {
    if (!newSessionTitle.trim()) return;
    
    try {
      await createStudySession.mutateAsync({
        title: newSessionTitle,
        scheduled_date: currentDate.toISOString().split('T')[0],
        session_type: 'study'
      });
      
      setNewSessionTitle('');
      setShowAddSession(false);
      
      toast({
        title: "Study session scheduled!",
        description: "New session has been added to your calendar.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create study session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const upcomingExams = [
    { name: 'RRB JE IT', date: '2024-05-15', daysLeft: 120 },
    { name: 'UPSC Prelims', date: '2024-06-16', daysLeft: 152 },
    { name: 'UPSC Mains', date: '2024-09-20', daysLeft: 248 }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'test': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'study': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'revision': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const todaysSessions = studySessions.filter(session => 
    session.scheduled_date === currentDate.toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Study Calendar</h2>
        <p className="text-gray-600 mt-1">Plan your study schedule and track important exam dates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule
              </span>
              <Button size="sm" onClick={() => setShowAddSession(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showAddSession && (
              <div className="mb-4 p-3 border rounded-lg space-y-3">
                <Input
                  placeholder="Enter session title..."
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSession()}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddSession} disabled={!newSessionTitle.trim()}>
                    Add
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddSession(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {todaysSessions.length > 0 ? (
              <div className="space-y-3">
                {todaysSessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-600">
                        {session.start_time || '09:00'} • {session.duration_hours || 1}h
                      </p>
                      {session.description && (
                        <p className="text-sm text-gray-500 mt-1">{session.description}</p>
                      )}
                    </div>
                    <Badge className={getEventTypeColor(session.session_type)}>
                      {session.session_type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No events scheduled for today</p>
                <Button variant="outline" className="mt-2" onClick={() => setShowAddSession(true)}>
                  Schedule Study Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Upcoming Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExams.map((exam, index) => (
                <div key={index} className="p-3 rounded-lg border border-red-200 bg-red-50">
                  <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Date: {exam.date}</p>
                  <div className="mt-2">
                    <Badge variant="destructive">
                      {exam.daysLeft} days left
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly View */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studySessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{session.title}</h3>
                  <p className="text-sm text-gray-600">
                    {session.scheduled_date} at {session.start_time || '09:00'}
                  </p>
                  {session.subjects && (
                    <Badge variant="outline" className="mt-1">{session.subjects.name}</Badge>
                  )}
                </div>
                <Badge className={getEventTypeColor(session.session_type)}>
                  {session.session_type}
                </Badge>
              </div>
            ))}
            {studySessions.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No study sessions scheduled</p>
                <Button variant="outline" className="mt-2" onClick={() => setShowAddSession(true)}>
                  Schedule Your First Session
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
