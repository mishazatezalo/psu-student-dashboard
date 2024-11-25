import { NextResponse } from 'next/server'

const CANVAS_API_URL = 'https://psu.instructure.com/api/v1'
const CANVAS_API_KEY = process.env.CANVAS_API_KEY

interface Course {
  id: number;
  name: string;
}

interface Assignment {
  id: number;
  name: string;
  due_at: string | null;
  html_url: string;
  course_name?: string;
}

export async function GET() {
  console.log('Canvas API route called')
  console.log('CANVAS_API_KEY:', CANVAS_API_KEY ? 'Set' : 'Not set')
  console.log('Using Canvas API URL:', CANVAS_API_URL)
  
  if (!CANVAS_API_KEY) {
    console.error('Canvas API key is not set')
    return NextResponse.json({ error: 'Canvas API key is not configured' }, { status: 500 })
  }

  try {
    console.log('Fetching courses...')
    const coursesResponse = await fetch(`${CANVAS_API_URL}/courses?enrollment_state=active`, {
      headers: {
        'Authorization': `Bearer ${CANVAS_API_KEY}`,
        'Accept': 'application/json'
      },
      cache: 'no-store'
    })

    if (!coursesResponse.ok) {
      const errorJson = await coursesResponse.json()
      console.error('Failed to fetch courses:', errorJson)
      return NextResponse.json({ 
        error: `Failed to fetch courses: ${coursesResponse.statusText}`, 
        details: JSON.stringify(errorJson)
      }, { status: coursesResponse.status })
    }

    const courses: Course[] = await coursesResponse.json()
    console.log(`Fetched ${courses.length} courses`)

    let allAssignments: Assignment[] = []

    const twoWeeksFromNow = new Date()
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)

    for (const course of courses) {
      try {
        console.log(`Fetching assignments for course ${course.id}...`)
        const assignmentsResponse = await fetch(`${CANVAS_API_URL}/courses/${course.id}/assignments?include[]=submission&bucket=future`, {
          headers: {
            'Authorization': `Bearer ${CANVAS_API_KEY}`,
            'Accept': 'application/json'
          },
          cache: 'no-store'
        })

        if (!assignmentsResponse.ok) {
          console.error(`Failed to fetch assignments for course ${course.id}: ${assignmentsResponse.status} ${assignmentsResponse.statusText}`)
          continue
        }

        const assignments: Assignment[] = await assignmentsResponse.json()
        console.log(`Fetched ${assignments.length} assignments for course ${course.id}`)
        
        const filteredAssignments = assignments.filter(assignment => {
          if (!assignment.due_at) return false;
          const dueDate = new Date(assignment.due_at);
          return dueDate <= twoWeeksFromNow;
        });

        allAssignments = allAssignments.concat(
          filteredAssignments.map(assignment => ({
            ...assignment,
            course_name: course.name
          }))
        )
      } catch (error) {
        console.error(`Error fetching assignments for course ${course.id}:`, error)
      }
    }

    console.log(`Total assignments fetched: ${allAssignments.length}`)

    if (allAssignments.length === 0) {
      return NextResponse.json({ message: 'No assignments due within the next two weeks' }, { status: 200 })
    }

    // Sort assignments by due date
    allAssignments.sort((a, b) => {
      const dateA = a.due_at ? new Date(a.due_at).getTime() : Number.MAX_SAFE_INTEGER;
      const dateB = b.due_at ? new Date(b.due_at).getTime() : Number.MAX_SAFE_INTEGER;
      return dateA - dateB;
    });

    console.log(`Returning ${allAssignments.length} upcoming assignments`)
    return NextResponse.json(allAssignments)
  } catch (error) {
    console.error('Error in Canvas API route:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch assignments', 
      details: error instanceof Error ? error.message : 'Unknown error',
      apiUrl: CANVAS_API_URL
    }, { status: 500 })
  }
}
