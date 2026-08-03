import { localDateKey, recommendTask } from './lib/recommendation.js';

const LEGACY_KEYS = [
  'missionControl.missions.v1',
  'missionControl.checkin.v1',
  'missionControl.override.v1',
  'missionControl.timer.v1',
  'missionControl.events.v1',
  'missionControl.preferences.v2',
  'missionControl.activity.v2',
  'missionControl.cloud.v3'
];
const LANGUAGE_KEY = 'missionControl.language.v4';
const TIME_KEY = 'missionControl.availableMinutes.v4';

const I18N = {
  th: {
    authTitle: 'โฟกัสเฉพาะสิ่งที่ต้องทำ',
    authSubtitle: 'ลงชื่อเข้าใช้จากอุปกรณ์ใดก็เห็นรายการเดิม',
    userIdLabel: 'User ID', passcodeLabel: 'Passcode', authHint: 'อย่างน้อย 6 ตัวอักษร',
    signIn: 'เข้าสู่ระบบ', createAccount: 'สร้างบัญชี', switchToRegister: 'สร้างบัญชีใหม่', switchToLogin: 'มีบัญชีแล้ว เข้าสู่ระบบ',
    today: 'วันนี้', timeQuestion: 'ตอนนี้มีเวลากี่นาที?', doNow: 'ทำตอนนี้', minutes: 'นาที',
    noTask: 'ยังไม่มีงาน', addFirst: 'เพิ่มงานแรกเพื่อให้ระบบช่วยเลือก', doneNow: 'เสร็จแล้ว',
    tabToday: 'วันนี้', tabUpcoming: 'ถัดไป', tabDone: 'เสร็จ', emptyTitle: 'ไม่มีงานในรายการนี้', emptyText: 'แตะ + เพื่อเพิ่มงาน',
    addTask: 'เพิ่มงาน', editTask: 'แก้ไขงาน', whatToDo: 'ต้องทำอะไร?', taskPlaceholder: 'พิมพ์งานสั้น ๆ', nextActionSummary: 'เพิ่มขั้นตอนถัดไป', nextActionLabel: 'ขั้นตอนถัดไป', nextActionPlaceholder: 'เช่น ส่ง Draft ให้ Director review',
    when: 'เมื่อไหร่', dueToday: 'วันนี้', dueTomorrow: 'พรุ่งนี้', noDue: 'ไม่กำหนด', effort: 'ใช้เวลาประมาณ',
    workType: 'ลักษณะงาน', focus: 'โฟกัส', quick: 'งานสั้น', contact: 'ติดต่อ', important: 'สำคัญ', priorityHint: 'ดันงานนี้ขึ้นก่อนงานปกติ',
    delete: 'ลบ', save: 'บันทึก', account: 'บัญชี', syncStatus: 'ข้อมูลบันทึกในบัญชีนี้อัตโนมัติ', language: 'ภาษา', thai: 'ไทย', english: 'English',
    iphoneTitle: 'ใช้บน iPhone', iphoneText: 'เปิด Share แล้วเลือก Add to Home Screen', logout: 'ออกจากระบบ',
    saved: 'บันทึกแล้ว', deleted: 'ลบแล้ว', completed: 'ทำเสร็จแล้ว', restored: 'นำกลับมาทำแล้ว', signedOut: 'ออกจากระบบแล้ว',
    offline: 'ออฟไลน์ — ต้องเชื่อมอินเทอร์เน็ตเพื่อบันทึก', loading: 'กำลังโหลด…',
    dueOverdue: 'เกินกำหนด', dueTodayMeta: 'วันนี้', dueTomorrowMeta: 'พรุ่งนี้', noDateMeta: 'ไม่กำหนดวัน',
    reasonOverdue: 'เกินกำหนด', reasonDueToday: 'ครบกำหนดวันนี้', reasonDueTomorrow: 'ครบกำหนดพรุ่งนี้', reasonDueSoon: 'ครบกำหนดเร็ว ๆ นี้', reasonHigh: 'เป็นงานสำคัญ', reasonFits: 'พอดีกับเวลาที่มี',
    confirmDelete: 'ลบงานนี้หรือไม่?', titleRequired: 'กรุณากรอกชื่องาน', authFailed: 'ไม่สามารถเข้าสู่ระบบได้', networkError: 'เชื่อมต่อระบบไม่ได้',
    invalidUserId: 'User ID ใช้ a-z, 0-9, จุด, ขีด และ _ จำนวน 3–40 ตัว', invalidPasscode: 'Passcode ต้องมีอย่างน้อย 6 ตัวอักษร', userExists: 'User ID นี้ถูกใช้แล้ว', invalidCredentials: 'User ID หรือ Passcode ไม่ถูกต้อง', accountLocked: 'ลองผิดหลายครั้ง กรุณารอ 15 นาที',
    setupError: 'ระบบฐานข้อมูลยังไม่พร้อม', addTaskAria: 'เพิ่มงาน', accountAria: 'บัญชี'
  },
  en: {
    authTitle: 'Focus on what matters now',
    authSubtitle: 'Sign in anywhere and keep the same task list',
    userIdLabel: 'User ID', passcodeLabel: 'Passcode', authHint: 'At least 6 characters',
    signIn: 'Sign in', createAccount: 'Create account', switchToRegister: 'Create a new account', switchToLogin: 'Already have an account? Sign in',
    today: 'Today', timeQuestion: 'How much time do you have?', doNow: 'Do now', minutes: 'min',
    noTask: 'Nothing to do yet', addFirst: 'Add your first task and Mission Control will choose', doneNow: 'Done',
    tabToday: 'Today', tabUpcoming: 'Upcoming', tabDone: 'Done', emptyTitle: 'No tasks here', emptyText: 'Tap + to add a task',
    addTask: 'Add task', editTask: 'Edit task', whatToDo: 'What needs to be done?', taskPlaceholder: 'Write a short task', nextActionSummary: 'Add next step', nextActionLabel: 'Next step', nextActionPlaceholder: 'e.g. Send draft for Director review',
    when: 'When', dueToday: 'Today', dueTomorrow: 'Tomorrow', noDue: 'No date', effort: 'Estimated time',
    workType: 'Task type', focus: 'Focus', quick: 'Quick', contact: 'Contact', important: 'Important', priorityHint: 'Move this above normal tasks',
    delete: 'Delete', save: 'Save', account: 'Account', syncStatus: 'Your data is saved to this account automatically', language: 'Language', thai: 'ไทย', english: 'English',
    iphoneTitle: 'Use on iPhone', iphoneText: 'Open Share and choose Add to Home Screen', logout: 'Sign out',
    saved: 'Saved', deleted: 'Deleted', completed: 'Task completed', restored: 'Task restored', signedOut: 'Signed out',
    offline: 'Offline — connect to save changes', loading: 'Loading…',
    dueOverdue: 'Overdue', dueTodayMeta: 'Today', dueTomorrowMeta: 'Tomorrow', noDateMeta: 'No date',
    reasonOverdue: 'overdue', reasonDueToday: 'due today', reasonDueTomorrow: 'due tomorrow', reasonDueSoon: 'due soon', reasonHigh: 'high priority', reasonFits: 'fits the time available',
    confirmDelete: 'Delete this task?', titleRequired: 'Enter a task title', authFailed: 'Could not sign in', networkError: 'Could not connect to the service',
    invalidUserId: 'Use 3–40 characters: a-z, 0-9, dot, dash or underscore', invalidPasscode: 'Passcode must be at least 6 characters', userExists: 'This User ID is already in use', invalidCredentials: 'Invalid User ID or passcode', accountLocked: 'Too many attempts. Try again in 15 minutes',
    setupError: 'The database is not ready', addTaskAria: 'Add task', accountAria: 'Account'
  }
};

const state = {
  language: localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'th',
  authMode: 'login',
  user: null,
  tasks: [],
  view: 'today',
  availableMinutes: [15, 30, 60, 90].includes(Number(localStorage.getItem(TIME_KEY))) ? Number(localStorage.getItem(TIME_KEY)) : 30,
  editingTask: null,
  form: { dueMode: 'today', effort: 30, focusType: 'focus' },
  busy: false
};

const $ = id => document.getElementById(id);
const elements = Object.fromEntries([
  'offlineBanner','authView','authTitle','authSubtitle','authForm','userIdLabel','userIdInput','passcodeLabel','passcodeInput','authHint','authSubmit','authModeToggle','authLanguage','authError',
  'appView','todayLabel','todayDate','accountButton','timeQuestion','timeChips','recommendedLabel','recommendedTime','recommendedTitle','recommendedReason','completeRecommended',
  'tabToday','tabUpcoming','tabDone','todayCount','upcomingCount','doneCount','taskList','emptyState','emptyTitle','emptyText','addTaskButton','sheetBackdrop',
  'taskSheet','taskSheetTitle','closeTaskSheet','taskForm','taskTitleLabel','taskTitleInput','nextActionDetails','nextActionSummary','nextActionLabel','taskNextActionInput','dueLegend','dueOptions','customDueDate','effortLegend','effortOptions','typeLegend','typeOptions','priorityLabel','priorityHint','priorityInput','taskFormError','deleteTaskButton','saveTaskButton',
  'accountSheet','accountTitle','closeAccountSheet','accountAvatar','accountUserId','syncStatus','languageToggle','languageRowLabel','languageValue','iphoneTitle','iphoneText','logoutButton','toast'
].map(id => [id, $(id)]));

function t(key) { return I18N[state.language][key] || key; }

function clearLegacyData() {
  if (localStorage.getItem('missionControl.legacyCleared.v4')) return;
  LEGACY_KEYS.forEach(key => localStorage.removeItem(key));
  localStorage.setItem('missionControl.legacyCleared.v4', new Date().toISOString());
}

function todayKey(offsetDays = 0) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return localDateKey(date);
}

function dateLabel(dateKey) {
  if (!dateKey) return t('noDateMeta');
  const today = todayKey();
  const tomorrow = todayKey(1);
  if (dateKey < today) return t('dueOverdue');
  if (dateKey === today) return t('dueTodayMeta');
  if (dateKey === tomorrow) return t('dueTomorrowMeta');
  return new Intl.DateTimeFormat(state.language === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short' })
    .format(new Date(`${dateKey}T12:00:00`));
}

function taskMeta(task) {
  const type = { focus: t('focus'), quick: t('quick'), contact: t('contact') }[task.focusType] || t('focus');
  return [`${task.effortMinutes} ${t('minutes')}`, type];
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const failure = new Error(payload?.error?.message || `HTTP ${response.status}`);
    failure.code = payload?.error?.code || 'REQUEST_FAILED';
    failure.status = response.status;
    throw failure;
  }
  return payload;
}

function errorText(error) {
  const mapping = {
    INVALID_USER_ID: 'invalidUserId', INVALID_PASSCODE: 'invalidPasscode', USER_EXISTS: 'userExists',
    INVALID_CREDENTIALS: 'invalidCredentials', ACCOUNT_LOCKED: 'accountLocked', DATABASE_NOT_READY: 'setupError',
    LOGIN_FAILED: 'setupError', REGISTER_FAILED: 'setupError', ACCOUNT_FAILED: 'setupError'
  };
  if (!navigator.onLine || error instanceof TypeError) return t('networkError');
  return mapping[error.code] ? t(mapping[error.code]) : (error.message || t('authFailed'));
}

function setBusy(value) {
  state.busy = value;
  elements.authSubmit.disabled = value;
  elements.saveTaskButton.disabled = value;
  elements.logoutButton.disabled = value;
}

function setAuthError(message = '') {
  elements.authError.textContent = message;
  elements.authError.hidden = !message;
}

function setTaskError(message = '') {
  elements.taskFormError.textContent = message;
  elements.taskFormError.hidden = !message;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { elements.toast.hidden = true; }, 2200);
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  elements.authTitle.textContent = t('authTitle');
  elements.authSubtitle.textContent = t('authSubtitle');
  elements.userIdLabel.textContent = t('userIdLabel');
  elements.passcodeLabel.textContent = t('passcodeLabel');
  elements.authHint.textContent = t('authHint');
  elements.authSubmit.textContent = state.authMode === 'login' ? t('signIn') : t('createAccount');
  elements.authModeToggle.textContent = state.authMode === 'login' ? t('switchToRegister') : t('switchToLogin');
  elements.authLanguage.textContent = state.language === 'th' ? 'EN' : 'TH';
  elements.todayLabel.textContent = t('today');
  elements.timeQuestion.textContent = t('timeQuestion');
  elements.recommendedLabel.textContent = t('doNow');
  elements.completeRecommended.textContent = t('doneNow');
  elements.tabToday.firstChild.textContent = `${t('tabToday')} `;
  elements.tabUpcoming.firstChild.textContent = `${t('tabUpcoming')} `;
  elements.tabDone.firstChild.textContent = `${t('tabDone')} `;
  elements.emptyTitle.textContent = t('emptyTitle');
  elements.emptyText.textContent = t('emptyText');
  elements.addTaskButton.setAttribute('aria-label', t('addTaskAria'));
  elements.accountButton.setAttribute('aria-label', t('accountAria'));
  elements.taskSheetTitle.textContent = state.editingTask ? t('editTask') : t('addTask');
  elements.taskTitleLabel.textContent = t('whatToDo');
  elements.taskTitleInput.placeholder = t('taskPlaceholder');
  elements.nextActionSummary.textContent = t('nextActionSummary');
  elements.nextActionLabel.textContent = t('nextActionLabel');
  elements.taskNextActionInput.placeholder = t('nextActionPlaceholder');
  elements.dueLegend.textContent = t('when');
  const dueButtons = [...elements.dueOptions.querySelectorAll('button')];
  [t('dueToday'), t('dueTomorrow'), t('noDue')].forEach((label, index) => { dueButtons[index].textContent = label; });
  elements.effortLegend.textContent = t('effort');
  elements.typeLegend.textContent = t('workType');
  const typeButtons = [...elements.typeOptions.querySelectorAll('button')];
  [t('focus'), t('quick'), t('contact')].forEach((label, index) => { typeButtons[index].textContent = label; });
  elements.priorityLabel.textContent = t('important');
  elements.priorityHint.textContent = t('priorityHint');
  elements.deleteTaskButton.textContent = t('delete');
  elements.saveTaskButton.textContent = t('save');
  elements.accountTitle.textContent = t('account');
  elements.syncStatus.textContent = t('syncStatus');
  elements.languageRowLabel.textContent = t('language');
  elements.languageValue.textContent = state.language === 'th' ? t('thai') : t('english');
  elements.iphoneTitle.textContent = t('iphoneTitle');
  elements.iphoneText.textContent = t('iphoneText');
  elements.logoutButton.textContent = t('logout');
  elements.offlineBanner.textContent = t('offline');
  renderDate();
  if (state.user) render();
}

function renderDate() {
  elements.todayDate.textContent = new Intl.DateTimeFormat(state.language === 'th' ? 'th-TH' : 'en-GB', {
    weekday: 'long', day: 'numeric', month: 'long'
  }).format(new Date());
}

function showAuth() {
  elements.authView.hidden = false;
  elements.appView.hidden = true;
  closeSheets();
  applyTranslations();
  setTimeout(() => elements.userIdInput.focus(), 50);
}

function showApp() {
  elements.authView.hidden = true;
  elements.appView.hidden = false;
  elements.accountUserId.textContent = state.user.userId;
  const initial = state.user.userId.slice(0, 1).toUpperCase() || 'U';
  elements.accountAvatar.textContent = initial;
  elements.accountButton.textContent = initial;
  applyTranslations();
  render();
}

function filteredTasks() {
  const today = todayKey();
  if (state.view === 'done') return state.tasks.filter(task => task.status === 'done');
  if (state.view === 'upcoming') return state.tasks.filter(task => task.status === 'active' && (!task.dueDate || task.dueDate > today));
  return state.tasks.filter(task => task.status === 'active' && task.dueDate && task.dueDate <= today);
}

function updateCounts() {
  const today = todayKey();
  const todayCount = state.tasks.filter(task => task.status === 'active' && task.dueDate && task.dueDate <= today).length;
  const upcomingCount = state.tasks.filter(task => task.status === 'active' && (!task.dueDate || task.dueDate > today)).length;
  const doneCount = state.tasks.filter(task => task.status === 'done').length;
  elements.todayCount.textContent = todayCount;
  elements.upcomingCount.textContent = upcomingCount;
  elements.doneCount.textContent = doneCount;
}

function reasonText(recommendation) {
  if (!recommendation) return t('addFirst');
  const mapping = {
    overdue: 'reasonOverdue', dueToday: 'reasonDueToday', dueTomorrow: 'reasonDueTomorrow', dueSoon: 'reasonDueSoon', highPriority: 'reasonHigh', fitsTime: 'reasonFits'
  };
  const labels = recommendation.reasons.slice(0, 3).map(reason => t(mapping[reason] || reason));
  return labels.join(state.language === 'th' ? ' · ' : ' · ');
}

function renderRecommendation() {
  const recommendation = recommendTask(state.tasks, state.availableMinutes);
  elements.recommendedTime.textContent = `${state.availableMinutes}${state.availableMinutes === 90 ? '+' : ''} ${t('minutes')}`;
  if (!recommendation) {
    elements.recommendedTitle.textContent = t('noTask');
    elements.recommendedReason.textContent = t('addFirst');
    elements.completeRecommended.hidden = true;
    elements.completeRecommended.dataset.taskId = '';
    return;
  }
  elements.recommendedTitle.textContent = recommendation.task.title;
  elements.recommendedReason.textContent = reasonText(recommendation);
  elements.completeRecommended.hidden = false;
  elements.completeRecommended.dataset.taskId = recommendation.task.id;
}

function createTaskItem(task) {
  const item = document.createElement('article');
  item.className = `task-item${task.status === 'done' ? ' is-done' : ''}`;

  const check = document.createElement('button');
  check.className = 'task-check';
  check.type = 'button';
  check.textContent = '✓';
  check.setAttribute('aria-label', task.status === 'done' ? t('restored') : t('completed'));
  check.addEventListener('click', () => toggleTask(task));

  const content = document.createElement('div');
  content.className = 'task-content';
  content.tabIndex = 0;
  content.setAttribute('role', 'button');
  content.addEventListener('click', () => openTaskSheet(task));
  content.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') openTaskSheet(task);
  });

  const title = document.createElement('p');
  title.className = 'task-title';
  title.textContent = task.title;

  const meta = document.createElement('div');
  meta.className = 'task-meta';
  const due = document.createElement('span');
  due.textContent = dateLabel(task.dueDate);
  if (task.status === 'active' && task.dueDate && task.dueDate < todayKey()) due.className = 'is-overdue';
  meta.append(due);
  taskMeta(task).forEach(value => {
    const part = document.createElement('span');
    part.textContent = value;
    meta.append(part);
  });
  content.append(title);
  if (task.nextAction) {
    const next = document.createElement('p');
    next.className = 'task-next';
    next.textContent = `→ ${task.nextAction}`;
    content.append(next);
  }
  content.append(meta);

  const end = document.createElement('div');
  if (task.priority === 'high') {
    const priority = document.createElement('span');
    priority.className = 'task-priority is-high';
    priority.title = t('important');
    end.append(priority);
  } else {
    const chevron = document.createElement('span');
    chevron.className = 'task-chevron';
    chevron.textContent = '›';
    end.append(chevron);
  }

  item.append(check, content, end);
  return item;
}

function renderTaskList() {
  const tasks = filteredTasks();
  elements.taskList.replaceChildren(...tasks.map(createTaskItem));
  elements.emptyState.hidden = tasks.length > 0;
}

function render() {
  updateCounts();
  renderRecommendation();
  renderTaskList();
  [...elements.timeChips.querySelectorAll('button')].forEach(button => {
    button.classList.toggle('is-active', Number(button.dataset.minutes) === state.availableMinutes);
  });
  [elements.tabToday, elements.tabUpcoming, elements.tabDone].forEach(button => {
    button.classList.toggle('is-active', button.dataset.view === state.view);
  });
}

async function loadSession() {
  try {
    const payload = await api('/api/auth/me', { method: 'GET', headers: {} });
    state.user = payload.user;
    state.language = payload.user.language === 'en' ? 'en' : 'th';
    localStorage.setItem(LANGUAGE_KEY, state.language);
    await loadTasks();
    showApp();
  } catch (error) {
    if (error.status !== 401) setAuthError(errorText(error));
    showAuth();
  }
}

async function loadTasks() {
  const payload = await api('/api/tasks', { method: 'GET', headers: {} });
  state.tasks = payload.tasks || [];
}

async function handleAuth(event) {
  event.preventDefault();
  setAuthError();
  const userId = elements.userIdInput.value.trim();
  const passcode = elements.passcodeInput.value;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{2,39}$/u.test(userId)) return setAuthError(t('invalidUserId'));
  if (passcode.length < 6) return setAuthError(t('invalidPasscode'));

  setBusy(true);
  try {
    const endpoint = state.authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = await api(endpoint, {
      method: 'POST',
      body: JSON.stringify({ userId, passcode, language: state.language })
    });
    state.user = payload.user;
    state.language = payload.user.language === 'en' ? 'en' : 'th';
    localStorage.setItem(LANGUAGE_KEY, state.language);
    elements.passcodeInput.value = '';
    await loadTasks();
    showApp();
  } catch (error) {
    setAuthError(errorText(error));
  } finally {
    setBusy(false);
  }
}

function selectOption(container, attribute, value) {
  [...container.querySelectorAll('button')].forEach(button => {
    button.classList.toggle('is-active', button.dataset[attribute] === String(value));
  });
}

function openTaskSheet(task = null) {
  state.editingTask = task;
  state.form.dueMode = task?.dueDate === todayKey() ? 'today' : task?.dueDate === todayKey(1) ? 'tomorrow' : task?.dueDate ? 'custom' : 'none';
  state.form.effort = task?.effortMinutes || 30;
  state.form.focusType = task?.focusType || 'focus';
  elements.taskTitleInput.value = task?.title || '';
  elements.taskNextActionInput.value = task?.nextAction || '';
  elements.nextActionDetails.open = Boolean(task?.nextAction);
  elements.customDueDate.value = task?.dueDate || '';
  elements.priorityInput.checked = task?.priority === 'high';
  elements.deleteTaskButton.hidden = !task;
  selectOption(elements.dueOptions, 'due', state.form.dueMode);
  selectOption(elements.effortOptions, 'effort', state.form.effort);
  selectOption(elements.typeOptions, 'type', state.form.focusType);
  setTaskError();
  elements.taskSheet.hidden = false;
  elements.sheetBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  applyTranslations();
  setTimeout(() => elements.taskTitleInput.focus(), 60);
}

function openAccountSheet() {
  elements.accountSheet.hidden = false;
  elements.sheetBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeSheets() {
  elements.taskSheet.hidden = true;
  elements.accountSheet.hidden = true;
  elements.sheetBackdrop.hidden = true;
  document.body.style.overflow = '';
  setTaskError();
}

function selectedDueDate() {
  if (state.form.dueMode === 'today') return todayKey();
  if (state.form.dueMode === 'tomorrow') return todayKey(1);
  if (state.form.dueMode === 'none') return null;
  return elements.customDueDate.value || null;
}

async function saveTask(event) {
  event.preventDefault();
  setTaskError();
  const title = elements.taskTitleInput.value.trim();
  if (!title) return setTaskError(t('titleRequired'));
  const payload = {
    title,
    nextAction: elements.taskNextActionInput.value.trim(),
    dueDate: selectedDueDate(),
    priority: elements.priorityInput.checked ? 'high' : 'normal',
    effortMinutes: state.form.effort,
    focusType: state.form.focusType
  };
  setBusy(true);
  try {
    if (state.editingTask) {
      const response = await api(`/api/tasks/${encodeURIComponent(state.editingTask.id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
      state.tasks = state.tasks.map(task => task.id === response.task.id ? response.task : task);
    } else {
      const response = await api('/api/tasks', { method: 'POST', body: JSON.stringify(payload) });
      state.tasks.unshift(response.task);
    }
    closeSheets();
    render();
    showToast(t('saved'));
  } catch (error) {
    setTaskError(errorText(error));
  } finally {
    setBusy(false);
  }
}

async function toggleTask(task) {
  if (state.busy) return;
  setBusy(true);
  try {
    const nextStatus = task.status === 'done' ? 'active' : 'done';
    const response = await api(`/api/tasks/${encodeURIComponent(task.id)}`, { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) });
    state.tasks = state.tasks.map(item => item.id === response.task.id ? response.task : item);
    render();
    showToast(nextStatus === 'done' ? t('completed') : t('restored'));
  } catch (error) {
    showToast(errorText(error));
  } finally {
    setBusy(false);
  }
}

async function deleteTask() {
  if (!state.editingTask || !window.confirm(t('confirmDelete'))) return;
  setBusy(true);
  try {
    await api(`/api/tasks/${encodeURIComponent(state.editingTask.id)}`, { method: 'DELETE', body: undefined });
    state.tasks = state.tasks.filter(task => task.id !== state.editingTask.id);
    closeSheets();
    render();
    showToast(t('deleted'));
  } catch (error) {
    setTaskError(errorText(error));
  } finally {
    setBusy(false);
  }
}

async function logout() {
  setBusy(true);
  try { await api('/api/auth/logout', { method: 'POST', body: '{}' }); } catch (_) { /* clear local session UI anyway */ }
  state.user = null;
  state.tasks = [];
  closeSheets();
  showAuth();
  showToast(t('signedOut'));
  setBusy(false);
}

async function toggleLanguage() {
  state.language = state.language === 'th' ? 'en' : 'th';
  localStorage.setItem(LANGUAGE_KEY, state.language);
  applyTranslations();
  if (state.user) {
    try {
      const payload = await api('/api/profile/language', { method: 'PATCH', body: JSON.stringify({ language: state.language }) });
      state.user = payload.user;
    } catch (error) {
      showToast(errorText(error));
    }
  }
}

function bindEvents() {
  elements.authForm.addEventListener('submit', handleAuth);
  elements.authModeToggle.addEventListener('click', () => {
    state.authMode = state.authMode === 'login' ? 'register' : 'login';
    elements.passcodeInput.autocomplete = state.authMode === 'login' ? 'current-password' : 'new-password';
    setAuthError();
    applyTranslations();
  });
  elements.authLanguage.addEventListener('click', toggleLanguage);
  elements.accountButton.addEventListener('click', openAccountSheet);
  elements.addTaskButton.addEventListener('click', () => openTaskSheet());
  elements.closeTaskSheet.addEventListener('click', closeSheets);
  elements.closeAccountSheet.addEventListener('click', closeSheets);
  elements.sheetBackdrop.addEventListener('click', closeSheets);
  elements.taskForm.addEventListener('submit', saveTask);
  elements.deleteTaskButton.addEventListener('click', deleteTask);
  elements.logoutButton.addEventListener('click', logout);
  elements.languageToggle.addEventListener('click', toggleLanguage);

  elements.timeChips.addEventListener('click', event => {
    const button = event.target.closest('button[data-minutes]');
    if (!button) return;
    state.availableMinutes = Number(button.dataset.minutes);
    localStorage.setItem(TIME_KEY, String(state.availableMinutes));
    render();
  });

  [elements.tabToday, elements.tabUpcoming, elements.tabDone].forEach(button => {
    button.addEventListener('click', () => { state.view = button.dataset.view; render(); });
  });

  elements.completeRecommended.addEventListener('click', () => {
    const task = state.tasks.find(item => item.id === elements.completeRecommended.dataset.taskId);
    if (task) toggleTask(task);
  });

  elements.dueOptions.addEventListener('click', event => {
    const button = event.target.closest('button[data-due]');
    if (!button) return;
    state.form.dueMode = button.dataset.due;
    if (state.form.dueMode !== 'custom') elements.customDueDate.value = state.form.dueMode === 'today' ? todayKey() : state.form.dueMode === 'tomorrow' ? todayKey(1) : '';
    selectOption(elements.dueOptions, 'due', state.form.dueMode);
  });
  elements.customDueDate.addEventListener('change', () => {
    if (!elements.customDueDate.value) return;
    state.form.dueMode = 'custom';
    selectOption(elements.dueOptions, 'due', 'custom');
  });
  elements.effortOptions.addEventListener('click', event => {
    const button = event.target.closest('button[data-effort]');
    if (!button) return;
    state.form.effort = Number(button.dataset.effort);
    selectOption(elements.effortOptions, 'effort', state.form.effort);
  });
  elements.typeOptions.addEventListener('click', event => {
    const button = event.target.closest('button[data-type]');
    if (!button) return;
    state.form.focusType = button.dataset.type;
    selectOption(elements.typeOptions, 'type', state.form.focusType);
  });

  window.addEventListener('online', updateConnectivity);
  window.addEventListener('offline', updateConnectivity);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSheets(); });
}

function updateConnectivity() {
  elements.offlineBanner.hidden = navigator.onLine;
}

async function registerServiceWorker() {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    try { await navigator.serviceWorker.register('./service-worker.js'); } catch (error) { console.warn('service worker registration failed', error); }
  }
}

async function init() {
  clearLegacyData();
  bindEvents();
  updateConnectivity();
  applyTranslations();
  await registerServiceWorker();
  await loadSession();
}

init();
