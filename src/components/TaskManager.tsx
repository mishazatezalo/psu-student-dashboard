'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

type Task = {
  id: string
  text: string
  completed: boolean
  order: number
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [greeting, setGreeting] = useState('')
  const [taskSuggestion, setTaskSuggestion] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
    generateAISuggestions()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      setError('Failed to load tasks. Please try again later.')
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateAISuggestions = async () => {
    try {
      const response = await fetch('/api/ai-assistant')
      if (!response.ok) {
        throw new Error('Failed to fetch AI suggestions')
      }
      const data = await response.json()
      setGreeting(data.greeting)
      setTaskSuggestion(data.taskSuggestion)
    } catch (error) {
      console.error('Error fetching AI suggestions:', error)
      setGreeting('Welcome back!')
      setTaskSuggestion('Add a task for your next assignment')
    }
  }

  const addTask = async () => {
    if (newTask.trim()) {
      setIsAdding(true)
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newTask }),
        })
        if (!response.ok) {
          throw new Error('Failed to add task')
        }
        const addedTask = await response.json()
        setTasks(prevTasks => [...prevTasks, addedTask])
        setNewTask('')
        toast({
          title: "Task added",
          description: "Your new task has been added successfully.",
        })
      } catch (error) {
        console.error('Error adding task:', error)
        toast({
          title: "Error",
          description: "Failed to add task. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsAdding(false)
      }
    }
  }

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      try {
        const response = await fetch('/api/tasks', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...task, completed: !task.completed }),
        })
        if (!response.ok) {
          throw new Error('Failed to update task')
        }
        const updatedTask = await response.json()
        setTasks(tasks.map(t => t.id === id ? updatedTask : t))
        toast({
          title: "Task updated",
          description: `Task marked as ${updatedTask.completed ? 'completed' : 'incomplete'}.`,
        })
      } catch (error) {
        setError('Failed to update task. Please try again.')
        toast({
          title: "Error",
          description: "Failed to update task. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
      setTasks(tasks.filter(task => task.id !== id))
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#001E44]">Task Manager</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#001E44]" />
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2 text-red-500 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-lg text-[#1E407C] font-medium">{greeting}</p>
            </div>
            <div className="flex space-x-2 mb-6">
              <Input
                type="text"
                placeholder={taskSuggestion || "Add a new task"}
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="flex-grow border-[#001E44] focus-visible:ring-[#1E407C]"
                disabled={isAdding}
              />
              <Button 
                onClick={addTask} 
                className="bg-[#001E44] hover:bg-[#1E407C] transition-colors"
                disabled={isAdding || newTask.trim() === ''}
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span className="sr-only">Add Task</span>
              </Button>
            </div>
            <AnimatePresence mode="popLayout">
              {tasks.length === 0 ? (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center text-gray-500 py-8"
                >
                  No tasks yet. Add one to get started!
                </motion.p>
              ) : (
                <ul className="space-y-3">
                  {tasks.map(task => (
                    <motion.li
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleTask(task.id)}
                          className={`p-0 hover:bg-transparent ${task.completed ? 'text-green-500' : 'text-gray-400 hover:text-[#1E407C]'}`}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </Button>
                        <span 
                          className={`flex-1 transition-colors ${
                            task.completed 
                              ? 'text-gray-400 line-through' 
                              : 'text-[#001E44]'
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete task</span>
                      </Button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </AnimatePresence>
          </>
        )}
      </CardContent>
    </Card>
  )
}

