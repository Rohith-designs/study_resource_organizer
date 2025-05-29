
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { CheckSquare, Plus, Calendar, Flag } from 'lucide-react';
import { useState } from 'react';
import { useTasks, useUpdateTaskCompletion, useCreateTask } from '@/hooks/useTasks';
import { useSubjects } from '@/hooks/useSubjects';
import { useToast } from '@/hooks/use-toast';

export const TaskManager = () => {
  const { data: tasks = [] } = useTasks();
  const { data: subjects = [] } = useSubjects();
  const updateTaskCompletion = useUpdateTaskCompletion();
  const createTask = useCreateTask();
  const { toast } = useToast();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      await updateTaskCompletion.mutateAsync({
        taskId,
        completed: !currentStatus
      });
      
      toast({
        title: !currentStatus ? "Task completed!" : "Task marked incomplete",
        description: "Task status updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      await createTask.mutateAsync({
        title: newTaskTitle,
        priority: 'medium'
      });
      
      setNewTaskTitle('');
      setShowAddTask(false);
      
      toast({
        title: "Task created!",
        description: "New task has been added to your list.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const pendingTasks = tasks.filter(task => !task.completed);
  const overdueTasks = pendingTasks.filter(task => 
    task.due_date && new Date(task.due_date) < new Date()
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Task Manager</h2>
        <p className="text-gray-600 mt-1">Organize and track your daily study goals.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{pendingTasks.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
              </div>
              <Flag className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Overall Progress</h3>
            <span className="text-sm text-gray-600">{completedTasks}/{totalTasks} tasks</span>
          </div>
          <Progress value={completionRate} className="h-3" />
          <p className="text-sm text-gray-500 mt-2">{Math.round(completionRate)}% complete</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pending Tasks</span>
              <Button size="sm" onClick={() => setShowAddTask(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showAddTask && (
              <div className="mb-4 p-3 border rounded-lg space-y-3">
                <Input
                  placeholder="Enter task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                    Add
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddTask(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm">
                    <Checkbox 
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id, task.completed)}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {task.subjects && (
                          <Badge variant="outline">{task.subjects.name}</Badge>
                        )}
                        {task.due_date && (
                          <span className="text-xs text-gray-500">Due: {task.due_date}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No pending tasks</p>
                  <Button variant="outline" className="mt-2" onClick={() => setShowAddTask(true)}>
                    Add Your First Task
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.filter(task => task.completed).length > 0 ? (
                tasks.filter(task => task.completed).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border bg-green-50">
                    <Checkbox 
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id, task.completed)}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-through">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-green-200 text-green-800">
                          completed
                        </Badge>
                        {task.subjects && (
                          <Badge variant="outline">{task.subjects.name}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No completed tasks yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
