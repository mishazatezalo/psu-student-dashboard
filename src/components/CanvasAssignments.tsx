'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCcw, AlertCircle, Calendar, BookOpen, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Assignment {
  id: number;
  name: string;
  due_at: string | null;
  html_url: string;
  course_name: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

function getDaysUntilDue(dueDate: string | null): string {
  if (!dueDate) return 'No due date';
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Past due';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return '1 day left';
  return `${diffDays} days left`;
}

export default function CanvasAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorResponse | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      setError(null)
      setMessage(null)
      console.log('Fetching assignments...')
      const response = await fetch('/api/canvas')
      
      const data = await response.json()
      console.log('Response received:', data)

      if (!response.ok) {
        throw data as ErrorResponse
      }

      if (Array.isArray(data)) {
        setAssignments(data)
      } else if (data.message) {
        setMessage(data.message)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching assignments:', err)
      setError(err instanceof Error 
        ? { error: err.message } 
        : (err as ErrorResponse)
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  return (
    <Card className="bg-white/90">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-[#001E44]">Upcoming Assignments</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchAssignments}
          disabled={loading}
          className="text-[#001E44] hover:bg-[#1E407C]/10"
        >
          <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-10 w-10 animate-spin text-[#001E44]" />
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="h-6 w-6" />
              <p className="text-lg font-semibold">Error: {error.error}</p>
            </div>
            {error.details && (
              <p className="text-md text-gray-600 break-words">{error.details}</p>
            )}
            <Button 
              onClick={fetchAssignments}
              className="bg-[#001E44] hover:bg-[#1E407C] text-white"
            >
              Try Again
            </Button>
          </div>
        ) : message ? (
          <p className="text-lg text-[#001E44]">{message}</p>
        ) : assignments.length === 0 ? (
          <p className="text-lg text-[#001E44]">No upcoming assignments found.</p>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((assignment) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <CardContent className="p-4 flex-grow">
                      <a 
                        href={assignment.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full flex flex-col"
                      >
                        <h3 className="text-lg font-bold mb-2 text-[#001E44] line-clamp-2">{assignment.name}</h3>
                        <div className="space-y-2 flex-grow">
                          <div className="flex items-center text-[#1E407C]">
                            <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm font-medium">{assignment.course_name}</span>
                          </div>
                          <div className="flex items-center text-[#1E407C]">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">
                              {assignment.due_at ? new Date(assignment.due_at).toLocaleString() : 'No due date'}
                            </span>
                          </div>
                          <div className="flex items-center text-[#1E407C]">
                            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              {getDaysUntilDue(assignment.due_at)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            className="w-full bg-[#001E44] text-white border-[#001E44] hover:bg-[#00132B] transition-colors"
                          >
                            View Assignment
                          </Button>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}


