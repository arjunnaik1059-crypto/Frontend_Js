"use client";

import { useState, useRef } from "react";

const INITIAL_AGENTS = {
  support: {
    id: "support",
    name: "Customer Service",
    shortCode: "CS",
    system: "Zendesk & Stripe Billing",
    description:
      "Resolves routine tickets, verifies billing status, and drafts replies before escalating edge cases.",
    active: true,
    connected: true,
    hoursSaved: 6.5,
    inputPlaceholder: "Queue a support ticket (e.g., Upgrade seat count for Nimbus)...",
    quickPrompts: [
      "Send VAT invoice to Horizon Labs",
      "Troubleshoot webhook timeout alert",
      "Process annual plan switch request",
    ],
    tasks: [
      {
        id: 1,
        title: "Billing invoice copy for Acme Labs",
        summary: "Verified Stripe receipt #INV-4092 and attached PDF copy.",
        draft:
          "Hi Maya, I pulled your October invoice (#INV-4092) from Stripe and attached the PDF here. Your Pro workspace is active through November 30. Reply here if you need your billing address updated.",
        priority: "high",
        confidence: 98,
        status: "pending",
        time: "2m ago",
      },
      {
        id: 2,
        title: "SSO login error on team workspace",
        summary: "Checked auth logs, cleared expired SAML token, and notified admin.",
        draft:
          "Hi team, we detected an expired SAML certificate on your workspace and refreshed the session cache. Your members can sign in normally now.",
        priority: "medium",
        confidence: 94,
        status: "approved",
        time: "18m ago",
      },
    ],
  },
  hiring: {
    id: "hiring",
    name: "Talent Acquisition",
    shortCode: "TA",
    system: "Greenhouse ATS & Calendar",
    description:
      "Screens inbound profiles against role scorecards, ranks technical fit, and proposes interview slots.",
    active: true,
    connected: true,
    hoursSaved: 5.0,
    inputPlaceholder: "Queue a hiring task (e.g., Screen Aarav for Backend role)...",
    quickPrompts: [
      "Score top 5 Frontend applicants",
      "Send take-home rubric to shortlisted devs",
      "Book founder intro call for Lead Designer",
    ],
    tasks: [
      {
        id: 3,
        title: "Rohan Mehta - Full-Stack Engineer",
        summary: "92% stack match (React, Next.js, Postgres). Open slots picked for Thu.",
        draft:
          "Hi Rohan, your background building production Next.js apps stood out to our team. Would Thursday at 11:00 AM or 3:30 PM work for a quick 20-minute chat with our founder?",
        priority: "high",
        confidence: 95,
        status: "pending",
        time: "9m ago",
      },
      {
        id: 4,
        title: "Ananya Rao - Product Designer",
        summary: "Portfolio scored 9/10 on design systems. Intro invite synced to Calendar.",
        draft:
          "Hi Ananya, we loved the checkout redesign case study in your portfolio. We just sent over a calendar invite for Friday at 2:00 PM.",
        priority: "medium",
        confidence: 96,
        status: "approved",
        time: "41m ago",
      },
    ],
  },
  interviews: {
    id: "interviews",
    name: "User Interviews",
    shortCode: "UI",
    system: "Notion Feedback Hub & Linear",
    description:
      "Runs structured discovery chats, clusters repeat friction points, and files product insights automatically.",
    active: true,
    connected: true,
    hoursSaved: 4.5,
    inputPlaceholder: "Queue an interview topic (e.g., Analyze beta churn calls)...",
    quickPrompts: [
      "Cluster onboarding friction from 10 calls",
      "Summarize enterprise pricing objections",
      "Draft follow-up questions for power users",
    ],
    tasks: [
      {
        id: 5,
        title: "Onboarding flow feedback (14 beta users)",
        summary: "9 of 14 users asked for one-click CSV import during workspace setup.",
        draft:
          "Key Insight: First-run activation drops at step 3 when teams manually add records. Recommendation: Ship a lightweight CSV importer and link it to Linear issue #PRD-118.",
        priority: "high",
        confidence: 93,
        status: "pending",
        time: "14m ago",
      },
      {
        id: 6,
        title: "Pricing tier clarity check",
        summary: "Compiled direct user quotes into Q4 pricing brief in Notion.",
        draft:
          "Summary: Early-stage founders understood seat limits clearly, but 4 of 8 asked whether AI agent runs roll over month to month.",
        priority: "low",
        confidence: 91,
        status: "approved",
        time: "1h ago",
      },
    ],
  },
};

const INITIAL_LOGS = [
  {
    id: 101,
    agent: "Customer Service",
    action: "Synced SSO resolution note to Zendesk",
    time: "18m ago",
  },
  {
    id: 102,
    agent: "Talent Acquisition",
    action: "Booked portfolio review for Ananya Rao",
    time: "41m ago",
  },
  {
    id: 103,
    agent: "User Interviews",
    action: "Published pricing insights to Notion Hub",
    time: "1h ago",
  },
];

export default function AgentSuite() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [selectedTab, setSelectedTab] = useState("support");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newPriority, setNewPriority] = useState("high");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState(1);
  const [isRunningAutopilot, setIsRunningAutopilot] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activityLog, setActivityLog] = useState(INITIAL_LOGS);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimerRef = useRef(null);

  const currentAgent = agents[selectedTab];
  const agentList = Object.values(agents);
  const allTasks = agentList.flatMap((agent) => agent.tasks);

  const activeCount = agentList.filter((agent) => agent.active).length;
  const approvedCount = allTasks.filter((task) => task.status === "approved").length;
  const pendingCount = allTasks.filter((task) => task.status === "pending").length;
  const totalHoursSaved = agentList
    .reduce((sum, agent) => sum + agent.hoursSaved, 0)
    .toFixed(1);
  const avgConfidence = Math.round(
    allTasks.reduce((sum, task) => sum + task.confidence, 0) /
      Math.max(allTasks.length, 1)
  );

  const filteredTasks = currentAgent.tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" ? true : task.status === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.summary.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  function showToast(message) {
    setToastMessage(message);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastMessage("");
    }, 2600);
  }

  function pushLog(agentName, action) {
    setActivityLog((prev) => [
      {
        id: Date.now() + Math.random(),
        agent: agentName,
        action,
        time: "Just now",
      },
      ...prev.slice(0, 7),
    ]);
  }

  function handleToggleMaximize() {
    setIsMaximized((prev) => {
      const next = !prev;
      showToast(next ? "Maximized workspace view enabled" : "Restored standard view");
      return next;
    });
  }

  function toggleAgentStatus(agentId) {
    const target = agents[agentId];
    const nextState = !target.active;
    setAgents((prev) => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        active: nextState,
      },
    }));
    const note = nextState ? "Resumed live monitoring" : "Paused agent queue";
    pushLog(target.name, note);
    showToast(`${target.name}: ${note}`);
  }

  function toggleSystemConnection(agentId) {
    const target = agents[agentId];
    const nextState = !target.connected;
    setAgents((prev) => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        connected: nextState,
      },
    }));
    const note = nextState
      ? `Reconnected to ${target.system}`
      : `Disconnected from ${target.system}`;
    pushLog(target.name, note);
    showToast(note);
  }

  function updateTaskStatus(agentId, taskId, nextStatus) {
    const targetAgent = agents[agentId];
    const targetTask = targetAgent.tasks.find((task) => task.id === taskId);

    setAgents((prev) => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        hoursSaved:
          nextStatus === "approved"
            ? Number((prev[agentId].hoursSaved + 0.5).toFixed(1))
            : prev[agentId].hoursSaved,
        tasks: prev[agentId].tasks.map((task) =>
          task.id === taskId ? { ...task, status: nextStatus } : task
        ),
      },
    }));

    if (targetTask) {
      const note =
        nextStatus === "approved"
          ? `Synced "${targetTask.title}"`
          : `Dismissed "${targetTask.title}"`;
      pushLog(targetAgent.name, note);
      showToast(note);
    }
  }

  function updateTaskDraft(agentId, taskId, nextDraft) {
    setAgents((prev) => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        tasks: prev[agentId].tasks.map((task) =>
          task.id === taskId ? { ...task, draft: nextDraft } : task
        ),
      },
    }));
  }

  function createTask(titleText, priorityLevel) {
    const cleaned = titleText.trim();
    if (!cleaned) return;

    const newId = Date.now();
    const createdTask = {
      id: newId,
      title: cleaned,
      summary: `Agent analyzed context and prepared sync for ${currentAgent.system}.`,
      draft: `Draft prepared by ${currentAgent.name} Agent for "${cleaned}". Ready to review and sync directly to ${currentAgent.system}.`,
      priority: priorityLevel,
      confidence: 94,
      status: "pending",
      time: "Just now",
    };

    setAgents((prev) => ({
      ...prev,
      [selectedTab]: {
        ...prev[selectedTab],
        tasks: [createdTask, ...prev[selectedTab].tasks],
      },
    }));
    setExpandedTaskId(newId);
    setStatusFilter("all");
    pushLog(currentAgent.name, `Queued "${cleaned}"`);
    showToast(`Assigned to ${currentAgent.name} Agent`);
  }

  function handleAddTask(event) {
    event.preventDefault();
    createTask(newTaskTitle, newPriority);
    setNewTaskTitle("");
  }

  function handleRunAutopilot() {
    if (isRunningAutopilot || !currentAgent.active) return;
    const nextPending = currentAgent.tasks.find((task) => task.status === "pending");
    if (!nextPending) return;

    setIsRunningAutopilot(true);
    setTimeout(() => {
      updateTaskStatus(currentAgent.id, nextPending.id, "approved");
      setIsRunningAutopilot(false);
    }, 750);
  }

  const currentPendingCount = currentAgent.tasks.filter(
    (task) => task.status === "pending"
  ).length;
  const focusProgress = Math.min(Math.round((Number(totalHoursSaved) / 25) * 100), 100);

  return (
    <main className={`container ${isMaximized ? "container-maximized" : ""}`}>
      <div className="glass-card top-bar">
        <div className="top-bar-left">
          <span className="brand-mark">SS</span>
          <div className="brand-copy">
            <span className="brand-title">Smart Startups</span>
            <span className="brand-status">
              <span className="pulse-dot" />
              {activeCount} of 3 Agents Live
            </span>
          </div>
        </div>

        <div className="top-bar-right">
          <span className="beige-chip">{totalHoursSaved} hrs saved</span>
          <button
            type="button"
            className={`maximize-btn ${isMaximized ? "maximize-active" : ""}`}
            onClick={handleToggleMaximize}
            aria-pressed={isMaximized}
          >
            <span className="max-icon" aria-hidden="true">
              {isMaximized ? "⤡" : "⤢"}
            </span>
            <span>{isMaximized ? "Restore View" : "Maximize View"}</span>
          </button>
        </div>
      </div>

      {!isMaximized && (
        <header className="hero">
          <div className="hero-top">
            <span className="badge">
              <span className="pulse-dot" />
              Founder Command Center
            </span>
            <span className="version-pill">Next.js + React</span>
          </div>

          <h1>
            Building <span className="accent-text">Smart Startups</span>
          </h1>
          <p className="subtitle">
            Delegate customer service, talent acquisition, and user interviews to AI
            agents wired into your internal tools so you stay focused on high-impact
            decisions.
          </p>
        </header>
      )}

      <section className="suite">
        <div className="stats-grid">
          <div className="glass-card stat-card">
            <span className="stat-label">Active Agents</span>
            <strong className="stat-value">
              {activeCount} <span className="stat-sub">/ 3 online</span>
            </strong>
          </div>
          <div className="glass-card stat-card">
            <span className="stat-label">Pending Review</span>
            <strong className="stat-value neon-value">{pendingCount}</strong>
          </div>
          <div className="glass-card stat-card">
            <span className="stat-label">Synced Actions</span>
            <strong className="stat-value">{approvedCount}</strong>
          </div>
          <div className="glass-card stat-card">
            <span className="stat-label">Time Reclaimed</span>
            <strong className="stat-value">
              {totalHoursSaved}{" "}
              <span className="stat-sub">hrs ({avgConfidence}% acc)</span>
            </strong>
          </div>
        </div>

        <nav className="tabs" aria-label="AI Agent Modules">
          {agentList.map((agent) => {
            const tabPending = agent.tasks.filter((t) => t.status === "pending").length;
            return (
              <button
                key={agent.id}
                type="button"
                className={`glass-card tab ${selectedTab === agent.id ? "tab-active" : ""}`}
                onClick={() => {
                  setSelectedTab(agent.id);
                  setStatusFilter("all");
                  setSearchQuery("");
                  const firstTask = agent.tasks[0];
                  setExpandedTaskId(firstTask ? firstTask.id : null);
                }}
              >
                <span className="tab-code">{agent.shortCode}</span>
                <span className="tab-name">{agent.name}</span>
                {tabPending > 0 && <span className="tab-count">{tabPending}</span>}
                <span className={`dot ${agent.active ? "dot-on" : "dot-off"}`} />
              </button>
            );
          })}
        </nav>

        <div className={`workspace-grid ${isMaximized ? "workspace-maximized" : ""}`}>
          <div className="glass-card panel main-panel">
            <div className="panel-header">
              <div>
                <div className="title-row">
                  <h2>{currentAgent.name} Agent</h2>
                  <span
                    className={`sync-pill ${
                      currentAgent.connected ? "sync-live" : "sync-off"
                    }`}
                  >
                    {currentAgent.connected ? "Synced" : "Offline"}: {currentAgent.system}
                  </span>
                </div>
                <p className="description">{currentAgent.description}</p>
              </div>

              <div className="header-controls">
                <button
                  type="button"
                  className="autopilot-btn"
                  disabled={
                    isRunningAutopilot || !currentAgent.active || currentPendingCount === 0
                  }
                  onClick={handleRunAutopilot}
                >
                  {isRunningAutopilot ? "Running Autopilot..." : "Run Autopilot"}
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${currentAgent.active ? "btn-on" : "btn-off"}`}
                  onClick={() => toggleAgentStatus(currentAgent.id)}
                >
                  {currentAgent.active ? "Active" : "Paused"}
                </button>
              </div>
            </div>

            <form className="task-form" onSubmit={handleAddTask}>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder={currentAgent.inputPlaceholder}
                aria-label="Queue a new task for this agent"
              />
              <select
                value={newPriority}
                onChange={(event) => setNewPriority(event.target.value)}
                aria-label="Select task priority"
                className="priority-select"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button type="submit" className="primary-btn">
                Assign
              </button>
            </form>

            <div className="quick-prompts">
              <span className="quick-label">Quick assign:</span>
              {currentAgent.quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="prompt-chip"
                  onClick={() => createTask(prompt, "medium")}
                >
                  + {prompt}
                </button>
              ))}
            </div>

            <div className="toolbar">
              <div className="filter-group" role="group" aria-label="Filter by status">
                {["all", "pending", "approved", "dismissed"].map((filterKey) => (
                  <button
                    key={filterKey}
                    type="button"
                    className={`filter-pill ${
                      statusFilter === filterKey ? "filter-active" : ""
                    }`}
                    onClick={() => setStatusFilter(filterKey)}
                  >
                    {filterKey}
                  </button>
                ))}
              </div>

              <input
                type="search"
                className="search-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tasks..."
                aria-label="Search agent tasks"
              />
            </div>

            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                No tasks match this filter. Queue a new task above or switch tabs.
              </div>
            ) : (
              <ul className="task-list">
                {filteredTasks.map((task) => {
                  const isExpanded = expandedTaskId === task.id;
                  return (
                    <li
                      key={task.id}
                      className={`task-item ${isExpanded ? "task-expanded" : ""}`}
                    >
                      <div className="task-row">
                        <div className="task-info">
                          <div className="task-top">
                            <h3>{task.title}</h3>
                            <span className={`priority priority-${task.priority}`}>
                              {task.priority}
                            </span>
                            <span className={`status status-${task.status}`}>
                              {task.status}
                            </span>
                          </div>
                          <p>{task.summary}</p>
                          <div className="task-meta">
                            <span>AI Confidence: {task.confidence}%</span>
                            <span>Updated {task.time}</span>
                          </div>
                        </div>

                        <div className="task-actions">
                          <button
                            type="button"
                            className="ghost-btn"
                            onClick={() =>
                              setExpandedTaskId(isExpanded ? null : task.id)
                            }
                          >
                            {isExpanded ? "Hide Draft" : "Inspect Draft"}
                          </button>
                          {task.status === "pending" && (
                            <>
                              <button
                                type="button"
                                className="approve-btn"
                                onClick={() =>
                                  updateTaskStatus(currentAgent.id, task.id, "approved")
                                }
                              >
                                Approve & Sync
                              </button>
                              <button
                                type="button"
                                className="dismiss-btn"
                                onClick={() =>
                                  updateTaskStatus(currentAgent.id, task.id, "dismissed")
                                }
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="draft-drawer">
                          <label
                            htmlFor={`draft-${task.id}`}
                            className="draft-label"
                          >
                            Agent Output Draft (editable before sync)
                          </label>
                          <textarea
                            id={`draft-${task.id}`}
                            rows={3}
                            value={task.draft}
                            onChange={(event) =>
                              updateTaskDraft(
                                currentAgent.id,
                                task.id,
                                event.target.value
                              )
                            }
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <aside className="sidebar">
            <div className="glass-card side-panel">
              <div className="side-header">
                <h3>Founder Focus Goal</h3>
                <span className="focus-pct">{focusProgress}%</span>
              </div>
              <p className="side-sub">
                {totalHoursSaved} of 25 weekly operational hours handed off to agents.
              </p>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${focusProgress}%` }}
                />
              </div>
            </div>

            <div className="glass-card side-panel">
              <h3>Internal Systems</h3>
              <ul className="systems-list">
                {agentList.map((agent) => (
                  <li key={agent.id} className="system-row">
                    <div>
                      <strong>{agent.system}</strong>
                      <span>{agent.name}</span>
                    </div>
                    <button
                      type="button"
                      className={`mini-toggle ${
                        agent.connected ? "mini-on" : "mini-off"
                      }`}
                      onClick={() => toggleSystemConnection(agent.id)}
                    >
                      {agent.connected ? "Connected" : "Off"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card side-panel">
              <h3>Live Activity Feed</h3>
              <ul className="feed-list">
                {activityLog.map((entry) => (
                  <li key={entry.id} className="feed-item">
                    <span className="feed-dot" />
                    <div>
                      <p className="feed-action">{entry.action}</p>
                      <span className="feed-meta">
                        {entry.agent} · {entry.time}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {toastMessage && (
        <div className="toast-pill" role="status" aria-live="polite">
          <span className="pulse-dot" />
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
