# Penn State Student Dashboard

## Overview

The Penn State Student Dashboard is a comprehensive web application designed to help Penn State students manage their academic life more efficiently. This dashboard brings together various aspects of student life, including task management, weather information, campus news, and upcoming assignments from Canvas.

## Why I Built It

As a Penn State student, I realized that there was a need for a centralized platform where students could access all the important information they need on a daily basis. The goal was to create a tool that would:

1. Increase productivity by providing a clear overview of tasks and assignments
2. Keep students informed about campus news and events
3. Offer quick access to local weather information
4. Integrate with existing Penn State systems like Canvas

By combining these features into a single, user-friendly dashboard, students can save time and stay organized throughout their academic journey.

## How It Works

The dashboard consists of several key components:

1. **Task Manager**: Allows students to add, complete, and delete tasks. It uses AI to provide personalized task suggestions.
2. **Weather Widget**: Displays current weather conditions for State College, PA.
3. **News Feed**: Shows the latest news from Onward State, keeping students updated on campus events and news.
4. **Canvas Assignments**: Fetches and displays upcoming assignments from the Canvas LMS.

The application uses a Next.js backend to handle API requests and data management, while the frontend is built with React and styled using Tailwind CSS.

## Technologies and Packages Used

- **Next.js**: React framework for building the full-stack application
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: UI component library built on top of Tailwind CSS
- **Prisma**: ORM for database management
- **Framer Motion**: Animation library for React
- **Lucide React**: Icon library
- **date-fns**: JavaScript date utility library
- **RSS Parser**: For parsing the Onward State RSS feed
- **OpenWeather API**: For fetching weather data
- **Canvas LMS API**: For retrieving assignment data
- **Google AI (Gemini Pro)**: For generating AI-powered task suggestions

## Setup Instructions

Follow these steps to set up and run the Penn State Student Dashboard on your local machine:

1. **Clone the repository**
   \`\`\`
   git clone https://github.com/your-username/penn-state-student-dashboard.git
   cd penn-state-student-dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:
   \`\`\`
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   CANVAS_API_KEY=your_canvas_api_key
   GOOGLE_AI_API_KEY=your_gemini_api_key
   DATABASE_URL=your_database_url
   \`\`\`

4. **Set up the database**
   - Install PostgreSQL on your machine if you haven't already.
   - Create a new PostgreSQL database for the project.
   - Update the `DATABASE_URL` in your `.env.local` file with your PostgreSQL connection string.
   - Run the following commands to set up your database schema:
     \`\`\`
     npx prisma generate
     npx prisma db push
     \`\`\`

5. **Configure API keys**
   - **OpenWeather API**: 
     - Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/).
     - Generate an API key and add it to your `.env.local` file.
   - **Canvas API**:
     - Log in to your Canvas account.
     - Go to Account > Settings.
     - Scroll down to Approved Integrations and click "New Access Token".
     - Generate a token and add it to your `.env.local` file.
   - **Google AI (Gemini Pro)**:
     - Go to the [Google AI Studio](https://makersuite.google.com/app/apikey).
     - Create a new API key and add it to your `.env.local` file.

6. **Run the development server**
   \`\`\`
   npm run dev
   \`\`\`

7. **Open the application**
   Navigate to `http://localhost:3000` in your web browser to view the dashboard.

## Additional Configuration

- **Customizing the News Feed**: The current setup uses Onward State's RSS feed. If you want to use a different news source, update the URL in `app/api/news/route.ts`.
- **Adjusting the Weather Location**: The weather is set to State College, PA by default. To change this, update the `city` variable in `app/api/weather/route.ts`.
- **Modifying AI Suggestions**: The AI task suggestions can be customized by adjusting the prompt in `app/api/ai-assistant/route.ts`.

