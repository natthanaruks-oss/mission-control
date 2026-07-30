(() => {
  'use strict';

  const STORAGE_KEYS = {
    missions: 'missionControl.missions.v1',
    checkin: 'missionControl.checkin.v1',
    override: 'missionControl.override.v1',
    timer: 'missionControl.timer.v1'
  };

  const IMPACT_SCORES = { Critical: 100, High: 80, Medium: 55, Low: 25 };
  const ENERGY_ORDER = { Low: 1, Medium: 2, High: 3 };
  const COLUMN_CONFIG = [
    { id: 'must', title: 'Must Win Today', className: 'must' },
    { id: 'deep', title: 'Deep Focus', className: 'deep' },
    { id: 'quick', title: 'Quick Wins', className: 'quick' },
    { id: 'coord', title: 'Coordination', className: 'coord' },
    { id: 'wait', title: 'Waiting / Blocked', className: 'wait' }
  ];

  const viewMeta = {
    queue: ['Mission Queue', 'Manage, filter and review all active missions.'],
    my: ['My Missions', 'Review missions assigned to you.'],
    projects: ['Projects / Workstreams', 'See execution across commercial and BI workstreams.'],
    calendar: ['Calendar', 'Review due dates and planned focus blocks.'],
    reports: ['Reports & Radar', 'Monitor workload, risk and completion performance.'],
    archive: ['Archive', 'Review completed and archived missions.']
  };

  const uid = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `m-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const el = (id) => document.getElementById(id);
  const qsa = (selector) => [...document.querySelectorAll(selector)];

  let missions = loadMissions();
  let checkin = loadCheckin();
  let manualOverride = loadJSON(STORAGE_KEYS.override, null);
  let searchTerm = '';
  let activeView = 'today';
  let tableContext = 'queue';
  let timerInterval = null;
  let timer = loadJSON(STORAGE_KEYS.timer, { taskId: null, remaining: 0, running: false, lastTick: null });

  function todayAt(hour = 17, minute = 0, dayOffset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  }

  function seedMissions() {
    return [
      {
        id: uid(), title: 'Finalize July AR Provision Review',
        outcome: 'Reconciled provision file ready for Director review', owner: 'Natthanaruk', project: 'Monthly Management Pack',
        dueAt: todayAt(16, 0), effort: 60, impact: 'High', consequence: 90, commitment: 100, unlock: 80,
        focusType: 'Deep Analysis', energyRequired: 'High', readiness: 100, status: 'Not Started', nextAction: 'Reconcile Top 25 customer balances against the latest Aging file', blocker: '', progress: 0, createdAt: new Date().toISOString()
      },
      {
        id: uid(), title: 'Finalize Commercial Strategy Checklist',
        outcome: 'Approved checklist ready for circulation to project owners', owner: 'Natthanaruk', project: 'Commercial Strategy',
        dueAt: todayAt(14, 0), effort: 45, impact: 'High', consequence: 80, commitment: 100, unlock: 70,
        focusType: 'Review', energyRequired: 'Medium', readiness: 100, status: 'Not Started', nextAction: 'Review open comments and confirm final owners', blocker: '', progress: 20, createdAt: new Date().toISOString()
      },
      {
        id: uid(), title: 'Complete Sales Forecast Variance Analysis',
        outcome: 'Variance drivers quantified and explained for management review', owner: 'Natthanaruk', project: 'Sales Forecast',
        dueAt: todayAt(17, 30), effort: 90, impact: 'Critical', consequence: 95, commitment: 100, unlock: 65,
        focusType: 'Deep Analysis', energyRequired: 'High', readiness: 85, status: 'In Progress', nextAction: 'Analyze volume and GP variance by region', blocker: '', progress: 35, createdAt: new Date().toISOString()
      },
      {
        id: uid(), title: 'Build FY2027 Budget Scenario Model',
        outcome: 'Base, downside and stretch scenarios with traceable assumptions', owner: 'Natthanaruk', project: 'FY2027 Budget',
        dueAt: todayAt(17, 0, 1), effort: 120, impact: 'High', consequence: 75, commitment: 70, unlock: 50,
        focusType: 'Deep Analysis', energyRequired: 'High', readiness: 100, status: 'Not Started', nextAction: 'Set up volume and GP assumption table', blocker: '', progress: 0, createdAt: new Date().toISOString()
      },
      {
        id: uid(), title: 'Review New Product Margin Analysis',
        outcome: 'Validated margin assumptions and decision points for Commercial', owner: 'Natthanaruk', project: 'New Product',
        dueAt: todayAt(15, 0, 1), effort: 60, impact: 'Medium', consequence: 60, commitment: 70, unlock: 55,
        focusType: 'Review', energyRequired: 'Medium', readiness: 100, status: 'Not Started', nextAction: 'Recheck cost build-up and sensitivity', blocker: '', progress: 0, createdAt: new Date().toISOString()
      },
      {
        id: uid(), title: 'Approve Marketing Request',
        outcome: 'Request approved or returned with clear comments', owner: 'Natthanaruk', project: 'Approvals',
        dueAt: todayAt(15, 0), effort: 10, impact: 'Medium', consequence: 55, commitment: 70, unlock: 90,
        focusType: 'Decision', energyRequired: 'Low', readiness: 100, status: 'Not Started', nextAction: 'Review budget and approve in workflow', blocker: '', progress: 0, createdAt: new Date().toISOString()
      },
      {
        id: uid(), title: 'Send Follow-up to Finance',
        outcome: 'Finance confirms timing for missing actual data', owner: 'Natthanaruk', project: 'Data Coordination',
        dueAt: todayAt(13, 30), effort: 10, impact: 'High', consequence: 80, commitment: 70, unlock: 100,
        focusType: 'Communication', energyRequired: 'Low', readiness: 100, status: 'Not Started', nextAction: 'Send concise follow-up with required fields and deadline', blocker: '', progress: 0, createdAt: new Date().toISOString()
      },
      {
        id: uid(), title: 'Update Project Status Report',
        outcome: 'Current status, risks and next milestones visible to management', owner: 'Natthanaruk', project: 'Project Governance',
        dueAt: todayAt(17, 0, 2), effort: 15, impact: 'Low', consequence: 35, commitment: 70, unlock: 30,
        focusType: 'Administrative', energyRequired: 'Low', readiness: 100, status: 'Not Started', nextAction: 'Update progress and blockers for active projects', blocker: '', progress: 0, createdAt: new Date().toISOString()
      },
      {
        id: uid(), title: 'Follow up Accounting for Aging File',
        outcome: 'Latest Aging file received for provision reconciliation', owner: 'Natthanaruk', project: 'Monthly Management Pack',
        dueAt: todayAt(11, 0), effort: 15, impact: 'High', consequence: 85, commitment: 70, unlock: 100,
        focusType: 'Communication', energyRequired: 'Low', readiness: 100, status: 'Not Started', nextAction: 'Contact Accounting and confirm delivery time', blocker: '', progress: 0, createdAt: new Date().toISOString()
      },
      {
        id: uid(), title: 'Confirm Meeting with Vendor',
        outcome: 'Vendor meeting time and participant list confirmed', owner: 'Natthanaruk', project: 'Vendor Management',
        dueAt: todayAt(16, 30), effort: 10, impact: 'Medium', consequence: 45, commitment: 70, unlock: 60,
        focusType: 'Communication', energyRequired: 'Low', readiness: 100, status: 'Not Started', nextAction: 'Send time options and request confirmation', blocker: '', progress: 0, createdAt: new Date().toISOString()
      },
      {
        id: uid(), title: 'Waiting for Actual Data from Finance',
        outcome: 'Actual sales and GP data available for forecast analysis', owner: 'Natthanaruk', project: 'Sales Forecast',
        dueAt: todayAt(12, 0), effort: 30, impact: 'High', consequence: 80, commitment: 70, unlock: 80,
        focusType: 'Deep Analysis', energyRequired: 'High', readiness: 35, status: 'Waiting', nextAction: 'Follow up data owner at 1:00 PM', blocker: 'Finance actual file not received', progress: 10, createdAt: new Date().toISOString()
      },
      {
        id: uid(), title: 'Waiting Approval from Director',
        outcome: 'Management approval received to proceed', owner: 'Natthanaruk', project: 'Assignment Platform',
        dueAt: todayAt(17, 0, 1), effort: 15, impact: 'High', consequence: 70, commitment: 100, unlock: 85,
        focusType: 'Communication', energyRequired: 'Low', readiness: 35, status: 'Waiting', nextAction: 'Follow up tomorrow morning if no response', blocker: 'Pending Director approval', progress: 80, createdAt: new Date().toISOString()
      }
    ];
  }

  function loadMissions() {
    const loaded = loadJSON(STORAGE_KEYS.missions, null);
    if (Array.isArray(loaded) && loaded.length) return loaded;
    const seeds = seedMissions();
    localStorage.setItem(STORAGE_KEYS.missions, JSON.stringify(seeds));
    return seeds;
  }

  function loadCheckin() {
    return loadJSON(STORAGE_KEYS.checkin, {
      energy: 'High', availableHours: 4.5, currentBlock: 60, interruptions: 'Medium', mainOutcome: '', updatedAt: null
    });
  }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn(`Could not load ${key}`, error);
      return fallback;
    }
  }

  function saveMissions() {
    localStorage.setItem(STORAGE_KEYS.missions, JSON.stringify(missions));
  }

  function saveCheckin() {
    localStorage.setItem(STORAGE_KEYS.checkin, JSON.stringify(checkin));
  }

  function formatDateTime(value, includeTime = true) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return 'No due date';
    const options = includeTime
      ? { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }
      : { month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(d);
  }

  function toDateTimeLocal(value) {
    const d = new Date(value);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60_000);
    return local.toISOString().slice(0, 16);
  }

  function deadlineScore(task) {
    const now = Date.now();
    const due = new Date(task.dueAt).getTime();
    const hours = (due - now) / 3_600_000;
    if (hours < 0) return 100;
    if (hours <= 6) return 95;
    if (hours <= 24) return 88;
    if (hours <= 48) return 75;
    if (hours <= 72) return 62;
    if (hours <= 168) return 42;
    return 20;
  }

  function cognitiveFit(task) {
    const current = ENERGY_ORDER[checkin.energy] || 2;
    const required = ENERGY_ORDER[task.energyRequired] || 2;
    const diff = current - required;
    if (diff >= 0) return 100;
    if (diff === -1) return 55;
    return 20;
  }

  function timeFit(task) {
    const block = Number(checkin.currentBlock) || 30;
    const effort = Number(task.effort) || 30;
    if (effort <= block) return 100;
    if (effort <= block * 1.5) return 72;
    if (effort <= block * 2) return 48;
    return 20;
  }

  function scoreTask(task) {
    const impact = IMPACT_SCORES[task.impact] ?? 50;
    const deadline = deadlineScore(task);
    const readiness = Number(task.readiness ?? 100);
    const consequence = Number(task.consequence ?? 50);
    const commitment = Number(task.commitment ?? 50);
    const unlock = Number(task.unlock ?? 30);
    const cognitive = cognitiveFit(task);
    const time = timeFit(task);
    const weighted = impact * .25 + deadline * .20 + consequence * .15 + commitment * .10 + unlock * .10 + readiness * .10 + cognitive * .05 + time * .05;
    let adjusted = weighted;
    if (!task.nextAction?.trim()) adjusted -= 15;
    if (['Blocked', 'Waiting'].includes(task.status) || readiness <= 35) adjusted -= 45;
    if (task.status === 'Completed') adjusted = 0;
    return Math.max(0, Math.round(adjusted));
  }

  function taskHealth(task) {
    if (task.status === 'Completed') return 'Completed';
    if (task.status === 'Blocked') return 'Blocked';
    if (task.status === 'Waiting' || Number(task.readiness) <= 35) return 'Waiting';
    const due = new Date(task.dueAt).getTime();
    const hours = (due - Date.now()) / 3_600_000;
    if (hours < 0) return 'Overdue';
    if (hours <= 24 && scoreTask(task) >= 60) return 'At Risk';
    if (hours <= 48 && Number(task.progress || 0) < 30) return 'At Risk';
    return 'On Track';
  }

  function isActionable(task) {
    return task.status !== 'Completed' && task.status !== 'Blocked' && task.status !== 'Waiting' && Number(task.readiness) > 35 && Boolean(task.nextAction?.trim());
  }

  function recommendedTask() {
    const overrideTask = manualOverride && missions.find(m => m.id === manualOverride.taskId && isActionable(m));
    if (overrideTask) return { task: overrideTask, overridden: true };
    const actionable = missions.filter(isActionable);
    actionable.sort((a, b) => scoreTask(b) - scoreTask(a));
    return { task: actionable[0] || null, overridden: false };
  }

  function recommendationReasons(task) {
    const reasons = [];
    const health = taskHealth(task);
    const dueHours = (new Date(task.dueAt).getTime() - Date.now()) / 3_600_000;
    if (task.impact === 'Critical' || task.impact === 'High') reasons.push(`${task.impact.toLowerCase()} business impact`);
    if (dueHours < 0) reasons.push('overdue');
    else if (dueHours <= 8) reasons.push('due within the current workday');
    else if (dueHours <= 24) reasons.push('due within 24 hours');
    if (Number(task.unlock) >= 80) reasons.push('unlocks dependent work');
    if (Number(task.readiness) >= 90) reasons.push('all inputs are ready');
    if (cognitiveFit(task) >= 90) reasons.push(`fits your ${checkin.energy.toLowerCase()} energy level`);
    if (timeFit(task) >= 90) reasons.push(`fits the available ${checkin.currentBlock}-minute focus block`);
    if (health === 'At Risk') reasons.push('currently at risk');
    return reasons.slice(0, 4);
  }

  function priorityLabel(task) {
    const s = scoreTask(task);
    if (task.impact === 'Critical' || s >= 82) return 'Critical';
    if (s >= 66) return 'High';
    if (s >= 45) return 'Medium';
    return 'Low';
  }

  function classifyTask(task) {
    if (['Waiting', 'Blocked'].includes(task.status) || Number(task.readiness) <= 35) return 'wait';
    const health = taskHealth(task);
    const dueHours = (new Date(task.dueAt).getTime() - Date.now()) / 3_600_000;
    if ((health === 'Overdue' || dueHours <= 24) && scoreTask(task) >= 62) return 'must';
    if (task.focusType === 'Communication') return 'coord';
    if (Number(task.effort) <= 20 || ['Administrative', 'Decision'].includes(task.focusType)) return 'quick';
    return 'deep';
  }

  function renderAll() {
    renderHeader();
    renderMetrics();
    renderRecommendation();
    renderBoard();
    renderAlerts();
    renderWorkload();
    renderTable();
    renderTimer();
  }

  function renderHeader() {
    const now = new Date();
    const hour = now.getHours();
    const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    el('greeting').textContent = `Good ${period}, Natthanaruk. Let’s win today.`;
    el('today-date').textContent = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(now);
    if (checkin.updatedAt) {
      el('checkin-time').textContent = `Updated ${new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit'}).format(new Date(checkin.updatedAt))}`;
    } else {
      el('checkin-time').textContent = 'Not completed today';
    }
  }

  function renderMetrics() {
    const active = missions.filter(m => m.status !== 'Completed');
    const overdue = active.filter(m => taskHealth(m) === 'Overdue').length;
    const risk = active.filter(m => taskHealth(m) === 'At Risk').length;
    el('metric-focus').textContent = `${Number(checkin.availableHours).toFixed(1)} hrs`;
    el('metric-energy').textContent = checkin.energy;
    el('metric-energy-time').textContent = checkin.updatedAt ? `Updated ${formatDateTime(checkin.updatedAt)}` : 'Update check-in';
    el('metric-overdue').textContent = overdue;
    el('metric-risk').textContent = risk;
    el('notification-count').textContent = overdue + risk;
    el('notification-count').style.display = overdue + risk ? 'grid' : 'none';
  }

  function renderRecommendation() {
    const container = el('recommended-content');
    const { task, overridden } = recommendedTask();
    if (!task) {
      container.innerHTML = `<div class="empty-recommendation"><strong>No actionable mission is ready.</strong>Clarify a next action or resolve a blocker to generate a recommendation.</div>`;
      return;
    }
    const reasons = recommendationReasons(task);
    const health = taskHealth(task);
    container.innerHTML = `
      <div class="rec-main">
        <div class="rec-visual">${icon('i-file-chart')}</div>
        <div class="rec-info">
          <h4>${escapeHTML(task.title)}</h4>
          <div class="tag-row">
            <span class="tag red">${icon('i-bolt')}${escapeHTML(task.impact.toUpperCase())} IMPACT</span>
            <span class="tag blue">${icon('i-clock')}DUE ${escapeHTML(formatDateTime(task.dueAt).toUpperCase())}</span>
            <span class="tag ${health === 'On Track' ? 'green' : 'amber'}">${icon(health === 'On Track' ? 'i-check' : 'i-alert')}${escapeHTML(health.toUpperCase())}</span>
            ${overridden ? `<span class="tag amber">${icon('i-edit')}MANUAL OVERRIDE</span>` : ''}
          </div>
          <div class="rec-details">
            <div class="detail-row"><span>${icon('i-clock')}Estimated Time</span><strong>${task.effort} min</strong></div>
            <div class="detail-row"><span>${icon('i-bolt')}Focus Type</span><strong>${escapeHTML(task.focusType)}</strong></div>
            <div class="detail-row"><span>${icon('i-target')}Priority Score</span><strong>${scoreTask(task)} / 100</strong></div>
            <div class="detail-row"><span>${icon('i-help')}Why Now</span><strong>${escapeHTML(reasons.join(', ') || 'Highest actionable score')}</strong></div>
          </div>
        </div>
        <div class="outcome-box"><small>EXPECTED OUTCOME</small><p>${escapeHTML(task.outcome)}</p></div>
      </div>
      <div class="rec-actions">
        <button class="primary-btn" data-rec-action="start" data-id="${task.id}">${icon('i-play')}Start Mission</button>
        <button class="secondary-btn" data-rec-action="schedule" data-id="${task.id}">${icon('i-calendar-plus')}Schedule Later</button>
        <button class="secondary-btn" data-rec-action="blocked" data-id="${task.id}">${icon('i-ban')}Mark Blocked</button>
        <button class="secondary-btn" data-rec-action="steps" data-id="${task.id}">${icon('i-branch')}Break into Steps</button>
        <button class="secondary-btn" data-rec-action="override" data-id="${task.id}">${icon('i-edit')}Override</button>
      </div>`;
  }

  function filteredMissions() {
    let result = missions.filter(m => m.status !== 'Completed');
    const filter = el('plan-filter')?.value || 'all';
    if (filter === 'mine') result = result.filter(m => m.owner.toLowerCase().includes('natthanaruk'));
    if (filter === 'overdue') result = result.filter(m => taskHealth(m) === 'Overdue');
    if (filter === 'risk') result = result.filter(m => taskHealth(m) === 'At Risk');
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m => [m.title,m.project,m.owner,m.nextAction].some(v => String(v || '').toLowerCase().includes(term)));
    }
    return result;
  }

  function renderBoard() {
    const board = el('mission-board');
    const data = filteredMissions();
    el('queue-count').textContent = `Mission Queue (${data.length})`;
    board.innerHTML = COLUMN_CONFIG.map(column => {
      const tasks = data.filter(task => classifyTask(task) === column.id).sort((a,b) => scoreTask(b)-scoreTask(a));
      const visibleTasks = tasks.slice(0, 3);
      return `<section class="board-column ${column.className}">
        <h4>${column.title} (${tasks.length})</h4>
        <div class="board-cards">
          ${visibleTasks.length ? visibleTasks.map(renderMissionCard).join('') : '<div class="column-empty">No missions</div>'}
          ${tasks.length > visibleTasks.length ? `<button class="more-column" data-view="queue">+${tasks.length - visibleTasks.length} more</button>` : ''}
        </div>
        <button class="add-column" data-action="open-intake">＋ Add Mission</button>
      </section>`;
    }).join('');
  }

  function renderMissionCard(task) {
    const health = taskHealth(task);
    const healthClass = health.toLowerCase().replaceAll(' ', '-');
    return `<article class="mission-card" data-edit-id="${task.id}">
      <h5>${escapeHTML(task.title)}</h5>
      <div class="card-meta"><span>${escapeHTML(formatDateTime(task.dueAt))}</span><span>${icon('i-clock')}${task.effort} min</span></div>
      <span class="card-health ${healthClass}">${escapeHTML(health)}</span>
    </article>`;
  }

  function renderAlerts() {
    const overdue = missions.filter(m => taskHealth(m) === 'Overdue').length;
    const risk = missions.filter(m => taskHealth(m) === 'At Risk').length;
    const blocked = missions.filter(m => ['Blocked','Waiting'].includes(taskHealth(m))).length;
    const alerts = [
      { type: 'red', icon: 'i-bell', title: `Overdue Missions (${overdue})`, copy: 'Needs your action', filter: 'overdue' },
      { type: 'amber', icon: 'i-alert', title: `At-Risk Missions (${risk})`, copy: 'Due soon or at risk', filter: 'risk' },
      { type: 'blue', icon: 'i-ban', title: `Blocked / Waiting (${blocked})`, copy: 'Requires follow-up or input', filter: 'waiting' }
    ];
    el('alerts-list').innerHTML = alerts.map(a => `<div class="alert-item ${a.type}" data-alert-filter="${a.filter}"><span class="alert-icon">${icon(a.icon)}</span><div class="alert-copy"><strong>${a.title}</strong><small>${a.copy}</small></div><span class="alert-arrow">${icon('i-chevron')}</span></div>`).join('');
  }

  function renderWorkload() {
    const active = missions.filter(m => m.status !== 'Completed');
    const total = active.length;
    const counts = {
      'On Track': active.filter(m => taskHealth(m) === 'On Track').length,
      'At Risk': active.filter(m => taskHealth(m) === 'At Risk').length,
      'Overdue': active.filter(m => taskHealth(m) === 'Overdue').length,
      'Waiting': active.filter(m => ['Waiting','Blocked'].includes(taskHealth(m))).length
    };
    const colors = { 'On Track': '#1d9b5f', 'At Risk': '#df8a13', Overdue: '#e14848', Waiting: '#8390a3' };
    const parts = [];
    let start = 0;
    Object.entries(counts).forEach(([key,count]) => {
      const end = total ? start + (count/total*100) : start;
      parts.push(`${colors[key]} ${start}% ${end}%`);
      start = end;
    });
    el('workload-donut').style.background = total ? `conic-gradient(${parts.join(',')})` : '#e4eaf1';
    el('workload-total').textContent = total;
    el('workload-total-footer').textContent = total;
    el('completed-week').textContent = missions.filter(m => m.status === 'Completed').length;
    el('workload-legend').innerHTML = Object.entries(counts).map(([key,count]) => `<div class="legend-row"><i class="legend-dot" style="background:${colors[key]}"></i><span>${key}</span><strong>${count}${total ? ` (${Math.round(count/total*100)}%)` : ''}</strong></div>`).join('');
  }

  function renderTable() {
    const body = el('mission-table-body');
    if (!body) return;
    const term = (el('table-search')?.value || '').toLowerCase();
    const status = el('table-status-filter')?.value || 'all';
    let data = [...missions];
    if (tableContext === 'my') data = data.filter(m => m.owner.toLowerCase().includes('natthanaruk'));
    if (tableContext === 'archive') data = data.filter(m => m.status === 'Completed');
    else data = data.filter(m => m.status !== 'Completed');
    if (tableContext === 'calendar') data.sort((a,b) => new Date(a.dueAt)-new Date(b.dueAt));
    else data.sort((a,b) => scoreTask(b)-scoreTask(a));
    if (term) data = data.filter(m => [m.title,m.owner,m.project,m.nextAction].some(v => String(v||'').toLowerCase().includes(term)));
    if (status !== 'all') data = data.filter(m => m.status === status);
    body.innerHTML = data.length ? data.map(task => `<tr data-edit-id="${task.id}">
      <td class="table-title"><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(task.project || 'No workstream')}</small></td>
      <td>${escapeHTML(task.owner)}</td><td>${escapeHTML(formatDateTime(task.dueAt))}</td>
      <td><span class="priority-pill ${priorityLabel(task).toLowerCase()}">${priorityLabel(task)}</span></td>
      <td><span class="status-pill">${escapeHTML(task.status)}</span></td><td>${escapeHTML(taskHealth(task))}</td><td><strong>${scoreTask(task)}</strong></td>
    </tr>`).join('') : '<tr><td colspan="7" style="text-align:center;color:#718197;padding:30px">No missions found.</td></tr>';
  }

  function openMissionModal(taskId = null) {
    const task = missions.find(m => m.id === taskId);
    el('mission-modal-title').textContent = task ? 'Edit Mission' : 'Create Mission';
    el('mission-id').value = task?.id || '';
    el('mission-title').value = task?.title || '';
    el('mission-outcome').value = task?.outcome || '';
    el('mission-owner').value = task?.owner || 'Natthanaruk';
    el('mission-project').value = task?.project || '';
    el('mission-due').value = task ? toDateTimeLocal(task.dueAt) : toDateTimeLocal(todayAt(17,0));
    el('mission-effort').value = String(task?.effort || 60);
    el('mission-impact').value = task?.impact || 'High';
    el('mission-consequence').value = String(task?.consequence || 55);
    el('mission-commitment').value = String(task?.commitment || 70);
    el('mission-unlock').value = String(task?.unlock || 30);
    el('mission-focus').value = task?.focusType || 'Deep Analysis';
    el('mission-energy').value = task?.energyRequired || 'Medium';
    el('mission-readiness').value = String(task?.readiness ?? 100);
    el('mission-status').value = task?.status || 'Not Started';
    el('mission-next').value = task?.nextAction || '';
    el('mission-blocker').value = task?.blocker || '';
    el('delete-mission').classList.toggle('hidden', !task);
    openModal('mission-modal');
  }

  function openCheckinModal() {
    qsa('input[name="energy"]').forEach(input => input.checked = input.value === checkin.energy);
    el('checkin-hours').value = checkin.availableHours;
    el('checkin-block').value = checkin.currentBlock;
    el('checkin-interruptions').value = checkin.interruptions;
    el('checkin-outcome').value = checkin.mainOutcome || '';
    openModal('checkin-modal');
  }

  function openOverrideModal() {
    const actionable = missions.filter(isActionable).sort((a,b) => scoreTask(b)-scoreTask(a));
    el('override-mission').innerHTML = actionable.map(m => `<option value="${m.id}">${escapeHTML(m.title)} — Score ${scoreTask(m)}</option>`).join('');
    openModal('override-modal');
  }

  function openModal(id) {
    el('modal-backdrop').classList.remove('hidden');
    el(id).classList.remove('hidden');
  }

  function closeModals() {
    el('modal-backdrop').classList.add('hidden');
    qsa('.modal').forEach(m => m.classList.add('hidden'));
  }

  function handleMissionSubmit(event) {
    event.preventDefault();
    const id = el('mission-id').value;
    const readiness = Number(el('mission-readiness').value);
    let status = el('mission-status').value;
    if (readiness === 0 && status !== 'Completed') status = 'Blocked';
    if (readiness === 35 && status === 'Not Started') status = 'Waiting';
    const payload = {
      id: id || uid(),
      title: el('mission-title').value.trim(), outcome: el('mission-outcome').value.trim(), owner: el('mission-owner').value.trim(), project: el('mission-project').value.trim(),
      dueAt: new Date(el('mission-due').value).toISOString(), effort: Number(el('mission-effort').value), impact: el('mission-impact').value,
      consequence: Number(el('mission-consequence').value), commitment: Number(el('mission-commitment').value), unlock: Number(el('mission-unlock').value),
      focusType: el('mission-focus').value, energyRequired: el('mission-energy').value, readiness, status,
      nextAction: el('mission-next').value.trim(), blocker: el('mission-blocker').value.trim(), progress: id ? (missions.find(m => m.id === id)?.progress || 0) : 0,
      createdAt: id ? (missions.find(m => m.id === id)?.createdAt || new Date().toISOString()) : new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    if (id) missions = missions.map(m => m.id === id ? payload : m);
    else missions.push(payload);
    saveMissions();
    manualOverride = null;
    localStorage.removeItem(STORAGE_KEYS.override);
    closeModals();
    renderAll();
    toast(id ? 'Mission updated.' : 'Mission created and prioritized.');
  }

  function deleteCurrentMission() {
    const id = el('mission-id').value;
    if (!id) return;
    if (!confirm('Delete this mission? This cannot be undone.')) return;
    missions = missions.filter(m => m.id !== id);
    saveMissions();
    if (manualOverride?.taskId === id) {
      manualOverride = null;
      localStorage.removeItem(STORAGE_KEYS.override);
    }
    closeModals();
    renderAll();
    toast('Mission deleted.');
  }

  function handleCheckinSubmit(event) {
    event.preventDefault();
    checkin = {
      energy: document.querySelector('input[name="energy"]:checked').value,
      availableHours: Number(el('checkin-hours').value), currentBlock: Number(el('checkin-block').value),
      interruptions: el('checkin-interruptions').value, mainOutcome: el('checkin-outcome').value.trim(), updatedAt: new Date().toISOString()
    };
    saveCheckin();
    manualOverride = null;
    localStorage.removeItem(STORAGE_KEYS.override);
    closeModals();
    renderAll();
    toast('Daily capacity updated. Recommendation recalculated.');
  }

  function handleOverrideSubmit(event) {
    event.preventDefault();
    manualOverride = { taskId: el('override-mission').value, reason: el('override-reason').value, at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.override, JSON.stringify(manualOverride));
    closeModals();
    renderRecommendation();
    toast('Recommendation overridden with reason recorded.');
  }

  function handleRecommendationAction(action, taskId) {
    const task = missions.find(m => m.id === taskId);
    if (!task) return;
    if (action === 'start') startMission(task);
    if (action === 'schedule') scheduleTask(task);
    if (action === 'blocked') markBlocked(task);
    if (action === 'steps') breakIntoSteps(task);
    if (action === 'override') openOverrideModal();
  }

  function startMission(task) {
    missions = missions.map(m => m.id === task.id ? { ...m, status: 'In Progress', updatedAt: new Date().toISOString() } : m);
    saveMissions();
    timer = { taskId: task.id, remaining: Math.min(Number(task.effort), Number(checkin.currentBlock)) * 60, running: true, lastTick: Date.now() };
    saveTimer();
    startTimerInterval();
    renderAll();
    el('focus-timer-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast(`Focus started: ${task.title}`);
  }

  function scheduleTask(task) {
    const input = prompt('Enter a new due date/time (YYYY-MM-DD HH:MM):', toDateTimeLocal(task.dueAt).replace('T',' '));
    if (!input) return;
    const parsed = new Date(input.replace(' ','T'));
    if (Number.isNaN(parsed.getTime())) return toast('Invalid date and time.');
    missions = missions.map(m => m.id === task.id ? { ...m, dueAt: parsed.toISOString(), updatedAt: new Date().toISOString() } : m);
    saveMissions(); renderAll(); toast('Mission rescheduled.');
  }

  function markBlocked(task) {
    const reason = prompt('What is blocking this mission?', task.blocker || '');
    if (reason === null) return;
    missions = missions.map(m => m.id === task.id ? { ...m, status: 'Blocked', readiness: 0, blocker: reason.trim() || 'Blocker not specified', updatedAt: new Date().toISOString() } : m);
    saveMissions(); manualOverride = null; localStorage.removeItem(STORAGE_KEYS.override); renderAll(); toast('Mission marked as blocked.');
  }

  function breakIntoSteps(task) {
    const raw = prompt('Enter steps separated by semicolons:', task.steps?.join('; ') || '');
    if (!raw) return;
    const steps = raw.split(';').map(s => s.trim()).filter(Boolean);
    missions = missions.map(m => m.id === task.id ? { ...m, steps, nextAction: steps[0] || m.nextAction, effort: Math.max(15, Math.round(Number(m.effort)/Math.max(1,steps.length))), updatedAt: new Date().toISOString() } : m);
    saveMissions(); renderAll(); toast(`${steps.length} execution steps recorded.`);
  }

  function saveTimer() {
    localStorage.setItem(STORAGE_KEYS.timer, JSON.stringify(timer));
  }

  function startTimerInterval() {
    clearInterval(timerInterval);
    if (!timer.running) return;
    timerInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.max(1, Math.floor((now - (timer.lastTick || now)) / 1000));
      timer.remaining = Math.max(0, timer.remaining - elapsed);
      timer.lastTick = now;
      if (timer.remaining <= 0) {
        timer.running = false;
        clearInterval(timerInterval);
        toast('Focus block complete. Review the outcome and close the mission.');
      }
      saveTimer(); renderTimer();
    }, 1000);
  }

  function renderTimer() {
    const task = missions.find(m => m.id === timer.taskId);
    const minutes = Math.floor((timer.remaining || 0) / 60);
    const seconds = Math.max(0, timer.remaining || 0) % 60;
    el('timer-display').textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    el('timer-state').textContent = timer.running ? 'Running' : task ? 'Paused' : 'Not running';
    el('timer-task').textContent = task ? task.title : 'Start a mission to begin focus timer';
    el('timer-pause').disabled = !task;
    el('timer-complete').disabled = !task;
    el('timer-pause').textContent = timer.running ? 'Pause' : 'Resume';
  }

  function toggleTimer() {
    if (!timer.taskId) return;
    timer.running = !timer.running;
    timer.lastTick = Date.now();
    saveTimer();
    if (timer.running) startTimerInterval(); else clearInterval(timerInterval);
    renderTimer();
  }

  function completeTimerTask() {
    const task = missions.find(m => m.id === timer.taskId);
    if (!task) return;
    missions = missions.map(m => m.id === task.id ? { ...m, status: 'Completed', progress: 100, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : m);
    saveMissions();
    timer = { taskId: null, remaining: 0, running: false, lastTick: null };
    saveTimer(); clearInterval(timerInterval); manualOverride = null; localStorage.removeItem(STORAGE_KEYS.override);
    renderAll(); toast('Mission accomplished.');
  }

  function switchView(view) {
    activeView = view;
    qsa('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
    if (view === 'today') {
      el('today-view').classList.add('active-view'); el('generic-view').classList.remove('active-view');
      el('page-title').textContent = 'Today Command Center'; renderAll(); return;
    }
    tableContext = view;
    el('today-view').classList.remove('active-view'); el('generic-view').classList.add('active-view');
    const [title, desc] = viewMeta[view] || viewMeta.queue;
    el('page-title').textContent = title; el('generic-title').textContent = title; el('generic-description').textContent = desc;
    renderTable();
  }

  function toast(message) {
    const node = el('toast');
    node.textContent = message; node.classList.remove('hidden');
    clearTimeout(node._timeout); node._timeout = setTimeout(() => node.classList.add('hidden'), 2800);
  }

  function icon(id) {
    return `<svg aria-hidden="true"><use href="#${id}"></use></svg>`;
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  }

  function closeSidebar() {
    document.body.classList.remove('sidebar-open');
  }

  function initEvents() {
    el('mobile-menu')?.addEventListener('click', () => document.body.classList.add('sidebar-open'));
    el('sidebar-close')?.addEventListener('click', closeSidebar);
    el('sidebar-scrim')?.addEventListener('click', closeSidebar);

    document.addEventListener('click', event => {
      const actionNode = event.target.closest('[data-action]');
      if (actionNode) {
        const action = actionNode.dataset.action;
        if (action === 'open-intake') openMissionModal();
        if (action === 'open-checkin') openCheckinModal();
        if (action === 'scroll-timer') el('focus-timer-section').scrollIntoView({ behavior:'smooth', block:'center' });
        if (action === 'open-settings') toast('Settings are reserved for the next version.');
        closeSidebar();
      }
      const viewNode = event.target.closest('[data-view]');
      if (viewNode) { switchView(viewNode.dataset.view); closeSidebar(); }
      const editNode = event.target.closest('[data-edit-id]');
      if (editNode) openMissionModal(editNode.dataset.editId);
      const recNode = event.target.closest('[data-rec-action]');
      if (recNode) handleRecommendationAction(recNode.dataset.recAction, recNode.dataset.id);
      const alertNode = event.target.closest('[data-alert-filter]');
      if (alertNode) {
        const map = { overdue:'overdue', risk:'risk', waiting:'all' };
        el('plan-filter').value = map[alertNode.dataset.alertFilter] || 'all';
        renderBoard();
        document.querySelector('.today-plan-panel').scrollIntoView({ behavior:'smooth', block:'start' });
      }
      if (event.target.matches('[data-close-modal]') || event.target.id === 'modal-backdrop') closeModals();
    });

    el('mission-form').addEventListener('submit', handleMissionSubmit);
    el('checkin-form').addEventListener('submit', handleCheckinSubmit);
    el('override-form').addEventListener('submit', handleOverrideSubmit);
    el('delete-mission').addEventListener('click', deleteCurrentMission);
    el('plan-filter').addEventListener('change', renderBoard);
    el('view-all-btn').addEventListener('click', () => switchView('queue'));
    el('view-alerts').addEventListener('click', () => switchView('queue'));
    el('refresh-recommendation').addEventListener('click', () => { manualOverride = null; localStorage.removeItem(STORAGE_KEYS.override); renderRecommendation(); toast('Recommendation recalculated.'); });
    el('search-toggle').addEventListener('click', () => { el('search-panel').classList.toggle('hidden'); if (!el('search-panel').classList.contains('hidden')) el('global-search').focus(); });
    el('global-search').addEventListener('input', event => { searchTerm = event.target.value.trim(); renderBoard(); });
    el('clear-search').addEventListener('click', () => { searchTerm = ''; el('global-search').value = ''; renderBoard(); });
    el('table-search').addEventListener('input', renderTable);
    el('table-status-filter').addEventListener('change', renderTable);
    el('timer-pause').addEventListener('click', toggleTimer);
    el('timer-complete').addEventListener('click', completeTimerTask);
    el('notification-btn').addEventListener('click', () => document.querySelector('.alerts-panel').scrollIntoView({ behavior:'smooth', block:'center' }));
    el('help-btn').addEventListener('click', () => toast('Recommendation = Business Priority × Deadline × Readiness × Focus Fit × Time Fit.'));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModals(); });
  }

  function init() {
    initEvents();
    renderAll();
    if (timer.running) {
      const elapsed = Math.floor((Date.now() - (timer.lastTick || Date.now())) / 1000);
      timer.remaining = Math.max(0, timer.remaining - elapsed);
      timer.lastTick = Date.now();
      if (timer.remaining > 0) startTimerInterval(); else timer.running = false;
    }
    renderTimer();
  }

  init();
})();
