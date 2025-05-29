
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Target, Clock, Award } from 'lucide-react';

export const ProgressAnalytics = () => {
  const weeklyStudyData = [
    { day: 'Mon', hours: 4.5, target: 5 },
    { day: 'Tue', hours: 3.2, target: 5 },
    { day: 'Wed', hours: 5.8, target: 5 },
    { day: 'Thu', hours: 4.1, target: 5 },
    { day: 'Fri', hours: 6.2, target: 5 },
    { day: 'Sat', hours: 7.5, target: 6 },
    { day: 'Sun', hours: 3.8, target: 4 },
  ];

  const subjectProgress = [
    { subject: 'Computer Science', completed: 85, total: 100, color: 'bg-blue-500' },
    { subject: 'General Studies', completed: 65, total: 100, color: 'bg-green-500' },
    { subject: 'Current Affairs', completed: 45, total: 100, color: 'bg-orange-500' },
    { subject: 'Quantitative Aptitude', completed: 75, total: 100, color: 'bg-purple-500' },
  ];

  const achievements = [
    { title: '7-Day Streak', description: 'Studied for 7 consecutive days', icon: '🔥', earned: true },
    { title: 'Early Bird', description: 'Started studying before 8 AM', icon: '🌅', earned: true },
    { title: 'Night Owl', description: 'Studied past midnight', icon: '🦉', earned: false },
    { title: 'Marathon', description: 'Studied for 8+ hours in a day', icon: '🏃', earned: true },
  ];

  const totalHours = weeklyStudyData.reduce((sum, day) => sum + day.hours, 0);
  const targetHours = weeklyStudyData.reduce((sum, day) => sum + day.target, 0);
  const averageDaily = totalHours / 7;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Progress Analytics</h2>
        <p className="text-gray-600 mt-1">Track your study patterns and performance insights.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Hours</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
                <p className="text-xs text-gray-500">Target: {targetHours}h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Average</p>
                <p className="text-2xl font-bold text-gray-900">{averageDaily.toFixed(1)}h</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last week
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Target Achievement</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round((totalHours/targetHours)*100)}%</p>
                <p className="text-xs text-orange-600">5 days on target</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">{achievements.filter(a => a.earned).length}</p>
                <p className="text-xs text-purple-600">3 this week</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Study Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyStudyData.map((day) => (
                <div key={day.day} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{day.day}</span>
                    <span className="text-gray-600">{day.hours}h / {day.target}h</span>
                  </div>
                  <div className="relative">
                    <Progress value={(day.hours / day.target) * 100} className="h-3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Subject-wise Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subjectProgress.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{subject.subject}</span>
                    <span className="text-sm text-gray-600">{subject.completed}%</span>
                  </div>
                  <Progress value={subject.completed} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Completed: {subject.completed} topics</span>
                    <span>Remaining: {subject.total - subject.completed} topics</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements & Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold text-sm">{achievement.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                  {achievement.earned && (
                    <Badge variant="default" className="mt-2 bg-green-600">
                      Earned
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Study Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Most Productive Time</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">2:00 PM - 5:00 PM</p>
              <p className="text-sm text-blue-700 mt-1">3.2 hours average focus time</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">Strongest Subject</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">Computer Science</p>
              <p className="text-sm text-green-700 mt-1">85% completion rate</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900">Focus Area</h3>
              <p className="text-2xl font-bold text-orange-600 mt-2">Current Affairs</p>
              <p className="text-sm text-orange-700 mt-1">Needs more attention</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
