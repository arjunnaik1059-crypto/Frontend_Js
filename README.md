Smart Startups: AI Founder Productivity Suite

A glassmorphic Next.js and React frontend designed to help startup founders automate repetitive tasks using autonomous AI agents. Delegate customer service, talent acquisition, and user interviews through intelligent workspaces connected to internal tools.

✨ Highlights
Black, Neon Green, and Beige Glass UI: Frosted glass layers, specular borders, ambient background lighting, and fluid transitions built using standard CSS.
Top Maximize View: One-click button in the top bar smoothly expands the workspace to full width for distraction-free focus.
Three AI Agent Workspaces: Switch seamlessly between Customer Service, Talent Acquisition, and User Interviews.
AI Autopilot & Editable Drafts: Run autopilot on pending queues or expand individual tasks to edit AI-generated drafts before syncing.
Priority Tags, Search & Filters: Organize tasks with priority levels and filter queues in real time.
Live Activity & Notifications: Monitor agent activity, toggle internal tool integrations, and receive live feedback through toast notifications.
🛠️ Tech Stack
Next.js 16 – App Router
React 19 – Component-based frontend
CSS3 – Custom glassmorphism styling
JavaScript – Application logic

No additional UI or styling dependencies required.

📁 Project Structure

After organizing the files, your project should look like this:

text
smart-startups/
│
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   └── AgentSuite.js
│
├── package.json
├── package-lock.json
├── next.config.js
└── README.md

🚀 Getting Started

Follow these steps to set up and run the project locally.

Step 1: Install Dependencies

Open your terminal in the project root directory and run:

bash
npm install

Step 2: Create Folders and Organize Files

If you are using Windows PowerShell, execute the following commands from your project root directory:

powershell
mkdir app, components

Move-Item globals.css, layout.js, page.js app\

Move-Item AgentSuite.js components\


This creates the required app and components directories and moves the files into their respective locations.

Note: Make sure globals.css, layout.js, page.js, and AgentSuite.js are present in your project root before running these commands.

If the folders or files have already been moved, do not run the commands again.

Step 3: Run the Development Server

Start the Next.js development server:

bash
npm run dev

Step 4: Open in Your Browser

Visit the following URL:

text
http://localhost:3000


Your Smart Startups AI Founder Productivity Suite should now be running locally.

🤖 AI Agent Workspaces

The application includes three dedicated AI-powered workspaces:

Customer Service: Manage customer queries, support tasks, and AI-generated responses.
Talent Acquisition: Streamline recruitment workflows and candidate communication.
User Interviews: Organize user research, interview tasks, and feedback collection.
🎨 Design Philosophy

The interface follows a modern glassmorphism design system featuring:

Obsidian black backgrounds.
Neon green interactive accents.
Warm beige highlights.
Translucent glass panels.
Soft ambient lighting.
Smooth animations and transitions.
Responsive workspace layouts.
📌 Future Enhancements
Integration with real AI models and APIs.
Automated customer support workflows.
ATS and recruitment platform integrations.
AI-powered interview analysis.
Real-time internal tool synchronization.
Advanced analytics and productivity dashboards.
📄 License

This project is available for personal learning, development, and experimentation. Add a license file if you intend to distribute it under specific terms.

Built for founders who want to spend less time managing repetitive tasks and more time building great startups. 🚀
