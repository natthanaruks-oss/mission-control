(() => {
  'use strict';

  const STORAGE_KEYS = {
    missions: 'missionControl.missions.v1',
    checkin: 'missionControl.checkin.v1',
    override: 'missionControl.override.v1',
    timer: 'missionControl.timer.v1',
    events: 'missionControl.events.v1',
    preferences: 'missionControl.preferences.v2',
    activity: 'missionControl.activity.v2'
  };

  const IMPACT_SCORES = { Critical: 100, High: 80, Medium: 55, Low: 25 };
  const ENERGY_ORDER = { Low: 1, Medium: 2, High: 3 };
  const EVENT_COLORS = { meeting: 'meeting', focus: 'focus', review: 'review', reminder: 'reminder', deadline: 'deadline', coordination: 'coordination' };
  const COLUMN_CONFIG = [
    { id: 'must', titleKey: 'mustWinToday', className: 'must' },
    { id: 'deep', titleKey: 'deepFocus', className: 'deep' },
    { id: 'quick', titleKey: 'quickWins', className: 'quick' },
    { id: 'coord', titleKey: 'coordination', className: 'coord' },
    { id: 'wait', titleKey: 'waitingBlocked', className: 'wait' }
  ];

  const I18N = {
    en: {
      todayCommandCenter: 'Today Command Center', missionQueue: 'Mission Queue', myMissions: 'My Missions', projectsWorkstreams: 'Projects / Workstreams',
      calendar: 'Calendar', reportsRadar: 'Reports & Radar', missionIntake: 'Mission Intake', focusTimer: 'Focus Timer', archive: 'Archive', settings: 'Settings',
      quickAddMission: 'Quick Add Mission', dailyCheckin: 'Daily Check-in', update: 'Update', availableFocusTime: 'Available Focus Time', energyLevel: 'Energy Level',
      todaysMeetings: "Today's Meetings", overdueMissions: 'Overdue Missions', atRiskMissions: 'At-Risk Missions', needsAction: 'Needs your action', dueSoonRisk: 'Due soon or at risk',
      recommendedNow: 'Recommended Now', recalculate: 'Recalculate', todayPlan: 'Today Plan', allActive: 'All active', mine: 'My missions', overdue: 'Overdue', atRisk: 'At risk',
      viewAll: 'View All', notRunning: 'Not running', startMissionTimer: 'Start a mission to begin focus timer', pause: 'Pause', resume: 'Resume', complete: 'Complete',
      focusTip: 'Focus Tip', focusTipText: '“Protect your highest-energy block for work that creates real impact.”', todaysSchedule: "Today's Schedule", viewCalendar: 'View Calendar',
      controlAlerts: 'Control Alerts', myWorkload: 'My Workload', viewReport: 'View Report', missions: 'Missions', total: 'Total', completedThisWeek: 'Completed This Week',
      manageActive: 'Manage, filter and review all active missions.', reviewMine: 'Review missions assigned to you.', projectsDesc: 'See execution across commercial and BI workstreams.',
      calendarDesc: 'Plan focus blocks, meetings and mission deadlines in one place.', reportsDesc: 'Monitor workload, risk and completion performance.', archiveDesc: 'Review completed and archived missions.',
      addMission: 'Add Mission', searchView: 'Search this view…', allStatuses: 'All statuses', mission: 'Mission', owner: 'Owner', due: 'Due', priority: 'Priority',
      status: 'Status', health: 'Health', score: 'Score', noMissionsFound: 'No missions found.', createMission: 'Create Mission', editMission: 'Edit Mission',
      missionTitle: 'Mission Title', expectedOutcome: 'Expected Outcome', projectWorkstream: 'Project / Workstream', dueDateTime: 'Due Date & Time', estimatedEffort: 'Estimated Effort',
      businessImpact: 'Business Impact', consequenceDelayed: 'Consequence if Delayed', commitment: 'Commitment', dependencyUnlock: 'Dependency Unlock', focusType: 'Focus Type',
      energyRequired: 'Energy Required', readiness: 'Readiness', nextAction: 'Next Action', blockerDependency: 'Blocker / Dependency', deleteMission: 'Delete Mission', cancel: 'Cancel', saveMission: 'Save Mission',
      dailyCapacity: 'Daily Capacity', currentEnergy: 'Current Energy', availableFocusToday: 'Available focus time today', uninterruptedBlock: 'Current uninterrupted block',
      interruptions: 'Interruptions', todaysMainOutcome: "Today's main outcome", updateRecommendation: 'Update Recommendation', manualOverride: 'Manual Override', chooseRecommended: 'Choose Recommended Mission',
      reason: 'Reason', applyOverride: 'Apply Override', high: 'High', medium: 'Medium', low: 'Low', critical: 'Critical', notStarted: 'Not Started', inProgress: 'In Progress', waiting: 'Waiting', blocked: 'Blocked', completed: 'Completed',
      onTrack: 'On Track', atRiskHealth: 'At Risk', overdueHealth: 'Overdue', completedHealth: 'Completed', waitingHealth: 'Waiting', blockedHealth: 'Blocked',
      deepAnalysis: 'Deep Analysis', decision: 'Decision', creativeWriting: 'Creative / Writing', review: 'Review', communication: 'Communication', administrative: 'Administrative',
      mustWinToday: 'Must Win Today', deepFocus: 'Deep Focus', quickWins: 'Quick Wins', coordination: 'Coordination', waitingBlocked: 'Waiting / Blocked', noMissions: 'No missions',
      noActionable: 'No actionable mission is ready.', clarifyBlocker: 'Clarify a next action or resolve a blocker to generate a recommendation.', estimatedTime: 'Estimated Time',
      priorityScore: 'Priority Score', whyNow: 'Why Now', highestScore: 'Highest actionable score', expectedOutcomeUpper: 'EXPECTED OUTCOME', startMission: 'Start Mission', scheduleLater: 'Schedule Later',
      markBlocked: 'Mark Blocked', breakSteps: 'Break into Steps', override: 'Override', impactUpper: 'IMPACT', manualOverrideTag: 'MANUAL OVERRIDE',
      overdueAlert: 'Overdue Missions', riskAlert: 'At-Risk Missions', blockedWaitingAlert: 'Blocked / Waiting', requiresFollowup: 'Requires follow-up or input',
      updated: 'Updated', notCompletedToday: 'Not completed today', updateCheckin: 'Update check-in', hoursShort: 'hrs', ofHours: 'of 8.0 hrs', next: 'Next', noMeetings: 'No meetings today',
      addEvent: 'Add Event', day: 'Day', week: 'Week', month: 'Month', year: 'Year', today: 'Today', unscheduledMissions: 'Unscheduled Missions',
      unscheduledCopy: 'Missions without a planned focus block.', calendarControl: 'Calendar Control', eventTitle: 'Event Title', eventType: 'Event Type', meeting: 'Meeting',
      focusBlock: 'Focus Block', reviewApproval: 'Review / Approval', reminder: 'Reminder', start: 'Start', end: 'End', linkedMission: 'Linked Mission', noLinkedMission: 'No linked mission', notes: 'Notes',
      deleteEvent: 'Delete Event', saveEvent: 'Save Event', addCalendarEvent: 'Add Calendar Event', editCalendarEvent: 'Edit Calendar Event', focusPlanning: 'Focus Planning', scheduleMission: 'Schedule Mission',
      duration: 'Duration', focusBlockType: 'Focus Block Type', deepFocusWork: 'Deep / Focus Work', coordinationType: 'Coordination', addToCalendar: 'Add to Calendar',
      defaultCalendarView: 'Default Calendar View', workdayStarts: 'Workday Starts', workdayEnds: 'Workday Ends', language: 'Language', dataBackup: 'Data Backup',
      dataBackupCopy: 'Export or restore missions, calendar events and preferences from this browser.', exportJson: 'Export JSON', importJson: 'Import JSON', saveSettings: 'Save Settings', yearOverview: 'Year Overview',
      plannedHours: 'Planned hours', focusBlocks: 'Focus blocks', deadlines: 'Deadlines', meetings: 'Meetings', visiblePeriod: 'Visible period', nothingScheduled: 'Nothing scheduled for this day.',
      schedule: 'Schedule', dueLabel: 'Due', allDayDeadline: 'Mission deadline', calendarEmpty: 'No calendar items', more: 'more', noUnscheduled: 'All active missions have a planned focus block.',
      eventCreated: 'Calendar event created.', eventUpdated: 'Calendar event updated.', eventDeleted: 'Calendar event deleted.', missionScheduled: 'Mission added to calendar.',
      missionCreated: 'Mission created and prioritized.', missionUpdated: 'Mission updated.', missionDeleted: 'Mission deleted.', missionBlocked: 'Mission marked as blocked.', missionAccomplished: 'Mission accomplished.',
      settingsSaved: 'Settings saved.', dataExported: 'Data backup exported.', dataImported: 'Data restored successfully.', invalidBackup: 'The selected backup file is invalid.',
      recommendationUpdated: 'Daily capacity updated. Recommendation recalculated.', recommendationRecalculated: 'Recommendation recalculated.', overrideRecorded: 'Recommendation overridden with reason recorded.',
      focusStarted: 'Focus started', focusComplete: 'Focus block complete. Review the outcome and close the mission.', invalidDate: 'Invalid date and time.', confirmDeleteMission: 'Delete this mission? This cannot be undone.',
      confirmDeleteEvent: 'Delete this calendar event?', enterBlocker: 'What is blocking this mission?', enterSteps: 'Enter steps separated by semicolons:', executionSteps: 'execution steps recorded.',
      langThai: 'TH', langEnglish: 'EN', calendarViewLabel: 'Calendar view', searchMissionsPlaceholder: 'Search missions, projects, owners or next actions…', searchThisViewPlaceholder: 'Search this view…',
      missionTitlePlaceholder: 'e.g. Finalize July AR Provision Review', outcomePlaceholder: 'What must be true when this mission is complete?', projectPlaceholder: 'e.g. Monthly Management Pack',
      nextActionPlaceholder: 'The exact next physical action', blockerPlaceholder: 'Leave blank if ready', mainOutcomePlaceholder: 'One outcome that would make today successful', eventTitlePlaceholder: 'e.g. Management Review',
      optional: 'Optional', notesPlaceholder: 'Agenda, location or preparation note', scoreWord: 'Score', noWorkstream: 'No workstream', min: 'min', monthSummary: 'missions / events',
      goodMorning: 'Good morning, Natthanaruk. Let’s win today.', goodAfternoon: 'Good afternoon, Natthanaruk. Let’s win today.', goodEvening: 'Good evening, Natthanaruk. Let’s win today.',
      becauseHighImpact: 'high business impact', becauseCriticalImpact: 'critical business impact', becauseOverdue: 'overdue', becauseToday: 'due within the current workday', because24h: 'due within 24 hours',
      becauseUnlocks: 'unlocks dependent work', becauseReady: 'all inputs are ready', becauseEnergy: 'fits your {energy} energy level', becauseTime: 'fits the available {minutes}-minute focus block', becauseRisk: 'currently at risk'
    },
    th: {
      todayCommandCenter: 'ศูนย์ควบคุมงานวันนี้', missionQueue: 'คิวภารกิจ', myMissions: 'ภารกิจของฉัน', projectsWorkstreams: 'โครงการ / สายงาน',
      calendar: 'ปฏิทิน', reportsRadar: 'รายงานและเรดาร์', missionIntake: 'สร้างภารกิจ', focusTimer: 'ตัวจับเวลาโฟกัส', archive: 'คลังงาน', settings: 'ตั้งค่า',
      quickAddMission: 'เพิ่มภารกิจด่วน', dailyCheckin: 'เช็กอินประจำวัน', update: 'อัปเดต', availableFocusTime: 'เวลาโฟกัสที่มี', energyLevel: 'ระดับพลังงาน',
      todaysMeetings: 'ประชุมวันนี้', overdueMissions: 'ภารกิจเกินกำหนด', atRiskMissions: 'ภารกิจเสี่ยงล่าช้า', needsAction: 'ต้องดำเนินการ', dueSoonRisk: 'ใกล้ครบกำหนดหรือมีความเสี่ยง',
      recommendedNow: 'แนะนำให้ทำตอนนี้', recalculate: 'คำนวณใหม่', todayPlan: 'แผนวันนี้', allActive: 'งานที่ยังเปิดทั้งหมด', mine: 'ภารกิจของฉัน', overdue: 'เกินกำหนด', atRisk: 'มีความเสี่ยง',
      viewAll: 'ดูทั้งหมด', notRunning: 'ยังไม่เริ่ม', startMissionTimer: 'เริ่มภารกิจเพื่อเปิดตัวจับเวลาโฟกัส', pause: 'หยุดชั่วคราว', resume: 'ทำต่อ', complete: 'เสร็จสิ้น',
      focusTip: 'คำแนะนำการโฟกัส', focusTipText: '“เก็บช่วงที่สมองพร้อมที่สุดไว้ให้งานที่สร้างผลกระทบจริง”', todaysSchedule: 'ตารางวันนี้', viewCalendar: 'ดูปฏิทิน',
      controlAlerts: 'สัญญาณควบคุม', myWorkload: 'ภาระงานของฉัน', viewReport: 'ดูรายงาน', missions: 'ภารกิจ', total: 'รวม', completedThisWeek: 'เสร็จในสัปดาห์นี้',
      manageActive: 'จัดการ กรอง และตรวจสอบภารกิจที่ยังดำเนินอยู่', reviewMine: 'ตรวจสอบภารกิจที่มอบหมายให้คุณ', projectsDesc: 'ดูการดำเนินงานแยกตามโครงการและสายงาน Commercial / BI',
      calendarDesc: 'วางแผนช่วงโฟกัส การประชุม และกำหนดส่งภารกิจในที่เดียว', reportsDesc: 'ติดตามภาระงาน ความเสี่ยง และผลการส่งมอบ', archiveDesc: 'ตรวจสอบภารกิจที่เสร็จสิ้นและจัดเก็บแล้ว',
      addMission: 'เพิ่มภารกิจ', searchView: 'ค้นหาในมุมมองนี้…', allStatuses: 'ทุกสถานะ', mission: 'ภารกิจ', owner: 'ผู้รับผิดชอบ', due: 'กำหนดส่ง', priority: 'ลำดับความสำคัญ',
      status: 'สถานะ', health: 'สุขภาพงาน', score: 'คะแนน', noMissionsFound: 'ไม่พบภารกิจ', createMission: 'สร้างภารกิจ', editMission: 'แก้ไขภารกิจ',
      missionTitle: 'ชื่อภารกิจ', expectedOutcome: 'ผลลัพธ์ที่คาดหวัง', projectWorkstream: 'โครงการ / สายงาน', dueDateTime: 'วันและเวลากำหนดส่ง', estimatedEffort: 'เวลาที่คาดว่าจะใช้',
      businessImpact: 'ผลกระทบต่อธุรกิจ', consequenceDelayed: 'ผลกระทบหากล่าช้า', commitment: 'ระดับคำมั่น', dependencyUnlock: 'การปลดล็อกงานอื่น', focusType: 'ประเภทการใช้สมาธิ',
      energyRequired: 'พลังงานที่ต้องใช้', readiness: 'ความพร้อม', nextAction: 'การดำเนินการถัดไป', blockerDependency: 'อุปสรรค / งานที่ต้องรอ', deleteMission: 'ลบภารกิจ', cancel: 'ยกเลิก', saveMission: 'บันทึกภารกิจ',
      dailyCapacity: 'กำลังการทำงานวันนี้', currentEnergy: 'พลังงานปัจจุบัน', availableFocusToday: 'เวลาโฟกัสที่มีวันนี้', uninterruptedBlock: 'ช่วงเวลาต่อเนื่องที่มีตอนนี้',
      interruptions: 'การถูกรบกวน', todaysMainOutcome: 'ผลลัพธ์หลักของวันนี้', updateRecommendation: 'อัปเดตคำแนะนำ', manualOverride: 'ปรับลำดับด้วยตนเอง', chooseRecommended: 'เลือกภารกิจที่จะแนะนำ',
      reason: 'เหตุผล', applyOverride: 'ยืนยันการปรับลำดับ', high: 'สูง', medium: 'ปานกลาง', low: 'ต่ำ', critical: 'วิกฤต', notStarted: 'ยังไม่เริ่ม', inProgress: 'กำลังดำเนินการ', waiting: 'รอข้อมูล', blocked: 'ติดอุปสรรค', completed: 'เสร็จสิ้น',
      onTrack: 'เป็นไปตามแผน', atRiskHealth: 'มีความเสี่ยง', overdueHealth: 'เกินกำหนด', completedHealth: 'เสร็จสิ้น', waitingHealth: 'รอข้อมูล', blockedHealth: 'ติดอุปสรรค',
      deepAnalysis: 'วิเคราะห์เชิงลึก', decision: 'ตัดสินใจ', creativeWriting: 'คิดสร้างสรรค์ / เขียน', review: 'ตรวจทาน', communication: 'สื่อสาร / ประสานงาน', administrative: 'งานธุรการ',
      mustWinToday: 'งานที่ต้องชนะวันนี้', deepFocus: 'งานโฟกัสลึก', quickWins: 'งานสั้นที่ปิดได้', coordination: 'งานประสานงาน', waitingBlocked: 'รอข้อมูล / ติดอุปสรรค', noMissions: 'ไม่มีภารกิจ',
      noActionable: 'ยังไม่มีภารกิจที่พร้อมให้ลงมือทำ', clarifyBlocker: 'ระบุ Next Action หรือปลดอุปสรรค เพื่อให้ระบบสร้างคำแนะนำ', estimatedTime: 'เวลาที่คาดว่าจะใช้',
      priorityScore: 'คะแนนความสำคัญ', whyNow: 'เหตุผลที่ควรทำตอนนี้', highestScore: 'คะแนนสูงสุดในกลุ่มงานที่พร้อมทำ', expectedOutcomeUpper: 'ผลลัพธ์ที่คาดหวัง', startMission: 'เริ่มภารกิจ', scheduleLater: 'จัดเวลาในปฏิทิน',
      markBlocked: 'ระบุว่าติดอุปสรรค', breakSteps: 'แบ่งเป็นขั้นตอน', override: 'ปรับลำดับ', impactUpper: 'ผลกระทบ', manualOverrideTag: 'ปรับด้วยตนเอง',
      overdueAlert: 'ภารกิจเกินกำหนด', riskAlert: 'ภารกิจเสี่ยงล่าช้า', blockedWaitingAlert: 'ติดอุปสรรค / รอข้อมูล', requiresFollowup: 'ต้องติดตามหรือรอข้อมูล',
      updated: 'อัปเดต', notCompletedToday: 'ยังไม่ได้เช็กอินวันนี้', updateCheckin: 'อัปเดตเช็กอิน', hoursShort: 'ชม.', ofHours: 'จาก 8.0 ชม.', next: 'ถัดไป', noMeetings: 'วันนี้ไม่มีประชุม',
      addEvent: 'เพิ่มรายการ', day: 'วัน', week: 'สัปดาห์', month: 'เดือน', year: 'ปี', today: 'วันนี้', unscheduledMissions: 'ภารกิจที่ยังไม่ได้จัดเวลา',
      unscheduledCopy: 'ภารกิจที่ยังไม่มีช่วงเวลาโฟกัสในปฏิทิน', calendarControl: 'ภาพรวมปฏิทิน', eventTitle: 'ชื่อรายการ', eventType: 'ประเภทรายการ', meeting: 'ประชุม',
      focusBlock: 'ช่วงโฟกัส', reviewApproval: 'ตรวจทาน / อนุมัติ', reminder: 'เตือนความจำ', start: 'เริ่ม', end: 'สิ้นสุด', linkedMission: 'ภารกิจที่เชื่อมโยง', noLinkedMission: 'ไม่เชื่อมโยงภารกิจ', notes: 'หมายเหตุ',
      deleteEvent: 'ลบรายการ', saveEvent: 'บันทึกรายการ', addCalendarEvent: 'เพิ่มรายการในปฏิทิน', editCalendarEvent: 'แก้ไขรายการในปฏิทิน', focusPlanning: 'วางแผนช่วงโฟกัส', scheduleMission: 'จัดเวลาภารกิจ',
      duration: 'ระยะเวลา', focusBlockType: 'ประเภทช่วงทำงาน', deepFocusWork: 'งานโฟกัส / วิเคราะห์ลึก', coordinationType: 'ประสานงาน', addToCalendar: 'เพิ่มลงปฏิทิน',
      defaultCalendarView: 'มุมมองปฏิทินเริ่มต้น', workdayStarts: 'เวลาเริ่มงาน', workdayEnds: 'เวลาสิ้นสุดงาน', language: 'ภาษา', dataBackup: 'สำรองข้อมูล',
      dataBackupCopy: 'ส่งออกหรือกู้คืนภารกิจ ปฏิทิน และการตั้งค่าจาก Browser นี้', exportJson: 'ส่งออก JSON', importJson: 'นำเข้า JSON', saveSettings: 'บันทึกการตั้งค่า', yearOverview: 'ภาพรวมรายปี',
      plannedHours: 'ชั่วโมงที่วางแผน', focusBlocks: 'ช่วงโฟกัส', deadlines: 'กำหนดส่ง', meetings: 'การประชุม', visiblePeriod: 'ช่วงที่แสดง', nothingScheduled: 'ไม่มีรายการในวันนี้',
      schedule: 'จัดเวลา', dueLabel: 'กำหนดส่ง', allDayDeadline: 'กำหนดส่งภารกิจ', calendarEmpty: 'ไม่มีรายการในปฏิทิน', more: 'รายการเพิ่มเติม', noUnscheduled: 'ภารกิจที่เปิดอยู่ทั้งหมดได้รับการจัดเวลาแล้ว',
      eventCreated: 'สร้างรายการในปฏิทินแล้ว', eventUpdated: 'อัปเดตรายการในปฏิทินแล้ว', eventDeleted: 'ลบรายการในปฏิทินแล้ว', missionScheduled: 'จัดเวลาภารกิจลงปฏิทินแล้ว',
      missionCreated: 'สร้างภารกิจและจัดลำดับแล้ว', missionUpdated: 'อัปเดตภารกิจแล้ว', missionDeleted: 'ลบภารกิจแล้ว', missionBlocked: 'ระบุภารกิจว่าติดอุปสรรคแล้ว', missionAccomplished: 'ภารกิจเสร็จสิ้น',
      settingsSaved: 'บันทึกการตั้งค่าแล้ว', dataExported: 'ส่งออกข้อมูลสำรองแล้ว', dataImported: 'กู้คืนข้อมูลสำเร็จ', invalidBackup: 'ไฟล์ข้อมูลสำรองไม่ถูกต้อง',
      recommendationUpdated: 'อัปเดตกำลังการทำงานและคำนวณคำแนะนำใหม่แล้ว', recommendationRecalculated: 'คำนวณคำแนะนำใหม่แล้ว', overrideRecorded: 'บันทึกการปรับลำดับพร้อมเหตุผลแล้ว',
      focusStarted: 'เริ่มโฟกัส', focusComplete: 'ครบช่วงเวลาโฟกัสแล้ว กรุณาตรวจผลลัพธ์และปิดภารกิจ', invalidDate: 'วันหรือเวลาไม่ถูกต้อง', confirmDeleteMission: 'ลบภารกิจนี้หรือไม่ การดำเนินการนี้ย้อนกลับไม่ได้',
      confirmDeleteEvent: 'ลบรายการในปฏิทินนี้หรือไม่', enterBlocker: 'อะไรคืออุปสรรคของภารกิจนี้?', enterSteps: 'กรอกขั้นตอนโดยคั่นด้วยเครื่องหมาย ;', executionSteps: 'ขั้นตอนได้รับการบันทึก',
      langThai: 'TH', langEnglish: 'EN', calendarViewLabel: 'มุมมองปฏิทิน', searchMissionsPlaceholder: 'ค้นหาภารกิจ โครงการ ผู้รับผิดชอบ หรือ Next Action…', searchThisViewPlaceholder: 'ค้นหาในมุมมองนี้…',
      missionTitlePlaceholder: 'เช่น สรุป AR Provision เดือนกรกฎาคม', outcomePlaceholder: 'เมื่อภารกิจเสร็จ ต้องมีผลลัพธ์อะไรเกิดขึ้น?', projectPlaceholder: 'เช่น Monthly Management Pack',
      nextActionPlaceholder: 'การดำเนินการถัดไปที่ชัดเจนและลงมือได้', blockerPlaceholder: 'เว้นว่างหากพร้อมดำเนินการ', mainOutcomePlaceholder: 'หนึ่งผลลัพธ์ที่ทำให้วันนี้ถือว่าสำเร็จ', eventTitlePlaceholder: 'เช่น Management Review',
      optional: 'ไม่บังคับ', notesPlaceholder: 'วาระ สถานที่ หรือสิ่งที่ต้องเตรียม', scoreWord: 'คะแนน', noWorkstream: 'ไม่ได้ระบุสายงาน', min: 'นาที', monthSummary: 'ภารกิจ / รายการ',
      goodMorning: 'สวัสดีตอนเช้า Natthanaruk วันนี้เลือกงานสำคัญแล้วทำให้สำเร็จ', goodAfternoon: 'สวัสดีตอนบ่าย Natthanaruk เดินหน้าภารกิจสำคัญต่อให้จบ', goodEvening: 'สวัสดีตอนเย็น Natthanaruk ปิดงานสำคัญและเตรียมวันถัดไป',
      becauseHighImpact: 'มีผลกระทบต่อธุรกิจสูง', becauseCriticalImpact: 'มีผลกระทบต่อธุรกิจระดับวิกฤต', becauseOverdue: 'เกินกำหนดแล้ว', becauseToday: 'ครบกำหนดภายในวันทำงานนี้', because24h: 'ครบกำหนดภายใน 24 ชั่วโมง',
      becauseUnlocks: 'ช่วยปลดล็อกงานที่เกี่ยวข้อง', becauseReady: 'ข้อมูลพร้อมครบถ้วน', becauseEnergy: 'เหมาะกับระดับพลังงาน {energy} ตอนนี้', becauseTime: 'เหมาะกับช่วงโฟกัส {minutes} นาทีที่มี', becauseRisk: 'กำลังมีความเสี่ยง'
    }
  };

  const ENUM_KEYS = {
    Critical: 'critical', High: 'high', Medium: 'medium', Low: 'low',
    'Not Started': 'notStarted', 'In Progress': 'inProgress', Waiting: 'waiting', Blocked: 'blocked', Completed: 'completed',
    'On Track': 'onTrack', 'At Risk': 'atRiskHealth', Overdue: 'overdueHealth',
    'Deep Analysis': 'deepAnalysis', Decision: 'decision', 'Creative / Writing': 'creativeWriting', Review: 'review', Communication: 'communication', Administrative: 'administrative'
  };


  const EXTRA_TRANSLATIONS = [
    ['Clear', 'ล้าง'], ['Manage, filter and review all missions.', 'จัดการ กรอง และตรวจสอบภารกิจทั้งหมด'], ['Focus. Prioritize. Execute.', 'โฟกัส จัดลำดับ และลงมือทำ'], ['Sales Operations & BI', 'Sales Operations & BI'], ['Online', 'ออนไลน์'],
    ['15 min', '15 นาที'], ['30 min', '30 นาที'], ['45 min', '45 นาที'], ['60 min', '60 นาที'], ['90 min', '90 นาที'], ['2 hrs', '2 ชั่วโมง'], ['3+ hrs', '3+ ชั่วโมง'],
    ['15 minutes', '15 นาที'], ['30 minutes', '30 นาที'], ['45 minutes', '45 นาที'], ['60 minutes', '60 นาที'], ['90 minutes', '90 นาที'], ['120 minutes', '120 นาที'], ['120+ minutes', '120+ นาที'],
    ['Severe — financial, customer or compliance impact', 'รุนแรง — กระทบการเงิน ลูกค้า หรือ Compliance'], ['High — blocks management or team delivery', 'สูง — ทำให้ Management หรือทีมส่งมอบงานไม่ได้'], ['Moderate — delay or rework', 'ปานกลาง — ทำให้งานล่าช้าหรือต้องแก้ไขใหม่'], ['Low — limited impact', 'ต่ำ — ผลกระทบจำกัด'],
    ['External / Management commitment', 'คำมั่นต่อลูกค้า / Management'], ['Internal team commitment', 'คำมั่นภายในทีม'], ['Self-planned', 'งานที่วางแผนเอง'],
    ['Unlocks multiple people or deliverables', 'ปลดล็อกหลายคนหรือหลาย Deliverables'], ['Unlocks one dependent activity', 'ปลดล็อกงานที่เกี่ยวข้องหนึ่งรายการ'], ['No major dependency', 'ไม่มี Dependency สำคัญ'],
    ['Ready — all inputs available', 'พร้อม — ข้อมูลครบ'], ['Mostly ready — minor gap', 'เกือบพร้อม — ขาดข้อมูลเล็กน้อย'], ['Not ready — waiting for input', 'ยังไม่พร้อม — รอข้อมูล'],
    ['Management instruction', 'คำสั่งจาก Management'], ['Customer urgency', 'ความเร่งด่วนของลูกค้า'], ['New information received', 'ได้รับข้อมูลใหม่'], ['Personal focus preference', 'เลือกตาม Focus ส่วนบุคคล'], ['Other', 'อื่น ๆ'],
    ['Review / Decision', 'ตรวจทาน / ตัดสินใจ'], ['Good morning. Let’s win today.', 'สวัสดี วันนี้เลือกงานสำคัญแล้วทำให้สำเร็จ'], ['Not completed', 'ยังไม่เสร็จ'], ['No linked mission', 'ไม่เชื่อมโยงภารกิจ']
  ];

  const viewMeta = {
    queue: ['missionQueue', 'manageActive'], my: ['myMissions', 'reviewMine'], projects: ['projectsWorkstreams', 'projectsDesc'],
    reports: ['reportsRadar', 'reportsDesc'], archive: ['archive', 'archiveDesc']
  };

  const store = {
    load(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        console.warn(`Could not load ${key}`, error);
        return fallback;
      }
    },
    save(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error(`Could not save ${key}`, error);
        return false;
      }
    }
  };

  const uid = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `m-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const el = id => document.getElementById(id);
  const qsa = selector => [...document.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  let preferences = store.load(STORAGE_KEYS.preferences, { language: 'th', calendarView: 'week', workdayStart: 8, workdayEnd: 18 });
  let missions = loadMissions();
  let checkin = store.load(STORAGE_KEYS.checkin, { energy: 'High', availableHours: 4.5, currentBlock: 60, interruptions: 'Medium', mainOutcome: '', updatedAt: null });
  let manualOverride = store.load(STORAGE_KEYS.override, null);
  let timer = store.load(STORAGE_KEYS.timer, { taskId: null, remaining: 0, running: false, lastTick: null });
  let calendarEvents = loadEvents();
  let activityLog = store.load(STORAGE_KEYS.activity, []);
  let timerInterval = null;
  let searchTerm = '';
  let activeView = 'today';
  let tableContext = 'queue';
  let calendarState = { mode: preferences.calendarView || 'week', cursor: startOfDay(new Date()) };

  function t(key, vars = {}) {
    let value = I18N[preferences.language]?.[key] ?? I18N.en[key] ?? key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  }

  function enumText(value) {
    return t(ENUM_KEYS[value] || value);
  }

  function locale() {
    return preferences.language === 'th' ? 'th-TH' : 'en-GB';
  }

  function startOfDay(date) {
    const d = new Date(date); d.setHours(0, 0, 0, 0); return d;
  }

  function endOfDay(date) {
    const d = new Date(date); d.setHours(23, 59, 59, 999); return d;
  }

  function addDays(date, amount) {
    const d = new Date(date); d.setDate(d.getDate() + amount); return d;
  }

  function addMonths(date, amount) {
    const d = new Date(date); d.setMonth(d.getMonth() + amount); return d;
  }

  function addYears(date, amount) {
    const d = new Date(date); d.setFullYear(d.getFullYear() + amount); return d;
  }

  function startOfWeek(date) {
    const d = startOfDay(date); const day = d.getDay(); const diff = day === 0 ? -6 : 1 - day; return addDays(d, diff);
  }

  function startOfMonth(date) {
    const d = startOfDay(date); d.setDate(1); return d;
  }

  function endOfMonth(date) {
    const d = startOfMonth(date); d.setMonth(d.getMonth() + 1); d.setMilliseconds(-1); return d;
  }

  function sameDay(a, b) {
    const x = new Date(a), y = new Date(b);
    return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
  }

  function dateKey(date) {
    const d = new Date(date); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function todayAt(hour = 17, minute = 0, dayOffset = 0) {
    const d = new Date(); d.setDate(d.getDate() + dayOffset); d.setHours(hour, minute, 0, 0); return d.toISOString();
  }

  function toDateTimeLocal(value) {
    const d = new Date(value); const offset = d.getTimezoneOffset(); return new Date(d.getTime() - offset * 60_000).toISOString().slice(0, 16);
  }

  function formatDateTime(value, includeTime = true) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    const options = includeTime
      ? { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }
      : { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat(locale(), options).format(d);
  }

  function formatTime(value) {
    return new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));
  }

  function formatDayHeader(value) {
    return new Intl.DateTimeFormat(locale(), { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(value));
  }

  function formatRange(start, end, mode) {
    if (mode === 'day') return new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(start);
    if (mode === 'week') return `${new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'short' }).format(start)} – ${new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'short', year: 'numeric' }).format(end)}`;
    if (mode === 'month') return new Intl.DateTimeFormat(locale(), { month: 'long', year: 'numeric' }).format(start);
    return new Intl.DateTimeFormat(locale(), { year: 'numeric' }).format(start);
  }

  function seedMissions() {
    return [
      { id: uid(), title: 'Finalize July AR Provision Review', outcome: 'Reconciled provision file ready for Director review', owner: 'Natthanaruk', project: 'Monthly Management Pack', dueAt: todayAt(16), effort: 60, impact: 'High', consequence: 90, commitment: 100, unlock: 80, focusType: 'Deep Analysis', energyRequired: 'High', readiness: 100, status: 'Not Started', nextAction: 'Reconcile Top 25 customer balances', blocker: '', progress: 20, createdAt: new Date().toISOString() },
      { id: uid(), title: 'Finalize Commercial Strategy Checklist', outcome: 'Management-ready checklist with owners and milestones', owner: 'Natthanaruk', project: 'Commercial Strategy', dueAt: todayAt(14), effort: 45, impact: 'High', consequence: 80, commitment: 100, unlock: 65, focusType: 'Review', energyRequired: 'Medium', readiness: 100, status: 'Not Started', nextAction: 'Validate action owners and due dates', blocker: '', progress: 40, createdAt: new Date().toISOString() },
      { id: uid(), title: 'Complete Sales Forecast Variance Analysis', outcome: 'Variance drivers confirmed for management discussion', owner: 'Natthanaruk', project: 'Sales Forecast', dueAt: todayAt(15, 30), effort: 90, impact: 'High', consequence: 85, commitment: 100, unlock: 70, focusType: 'Deep Analysis', energyRequired: 'High', readiness: 100, status: 'Not Started', nextAction: 'Reconcile actual volume against latest forecast', blocker: '', progress: 10, createdAt: new Date().toISOString() },
      { id: uid(), title: 'Build FY2027 Budget Scenario Model', outcome: 'Base, downside and upside scenarios with traceable assumptions', owner: 'Natthanaruk', project: 'FY2027 Budget', dueAt: todayAt(17, 0, 1), effort: 120, impact: 'High', consequence: 75, commitment: 70, unlock: 50, focusType: 'Deep Analysis', energyRequired: 'High', readiness: 100, status: 'Not Started', nextAction: 'Set up volume and GP assumption table', blocker: '', progress: 0, createdAt: new Date().toISOString() },
      { id: uid(), title: 'Approve Marketing Request', outcome: 'Request approved or returned with clear comments', owner: 'Natthanaruk', project: 'Approvals', dueAt: todayAt(15), effort: 10, impact: 'Medium', consequence: 55, commitment: 70, unlock: 90, focusType: 'Decision', energyRequired: 'Low', readiness: 100, status: 'Not Started', nextAction: 'Review budget and approve in workflow', blocker: '', progress: 0, createdAt: new Date().toISOString() },
      { id: uid(), title: 'Follow up Accounting for Aging File', outcome: 'Latest Aging file received for provision reconciliation', owner: 'Natthanaruk', project: 'Monthly Management Pack', dueAt: todayAt(11), effort: 15, impact: 'High', consequence: 85, commitment: 70, unlock: 100, focusType: 'Communication', energyRequired: 'Low', readiness: 100, status: 'Not Started', nextAction: 'Contact Accounting and confirm delivery time', blocker: '', progress: 0, createdAt: new Date().toISOString() },
      { id: uid(), title: 'Update Project Status Report', outcome: 'Current status, risks and next milestones visible to management', owner: 'Natthanaruk', project: 'Project Governance', dueAt: todayAt(17, 0, 2), effort: 15, impact: 'Low', consequence: 35, commitment: 70, unlock: 30, focusType: 'Administrative', energyRequired: 'Low', readiness: 100, status: 'Not Started', nextAction: 'Update progress and blockers for active projects', blocker: '', progress: 0, createdAt: new Date().toISOString() },
      { id: uid(), title: 'Waiting for Actual Data from Finance', outcome: 'Actual sales and GP data available for forecast analysis', owner: 'Natthanaruk', project: 'Sales Forecast', dueAt: todayAt(12), effort: 30, impact: 'High', consequence: 80, commitment: 70, unlock: 80, focusType: 'Deep Analysis', energyRequired: 'High', readiness: 35, status: 'Waiting', nextAction: 'Follow up data owner at 1:00 PM', blocker: 'Finance actual file not received', progress: 10, createdAt: new Date().toISOString() }
    ];
  }

  function loadMissions() {
    const loaded = store.load(STORAGE_KEYS.missions, null);
    if (Array.isArray(loaded) && loaded.length) return loaded;
    const seeds = seedMissions(); store.save(STORAGE_KEYS.missions, seeds); return seeds;
  }

  function loadEvents() {
    const loaded = store.load(STORAGE_KEYS.events, null);
    if (Array.isArray(loaded)) return loaded;
    const events = [
      { id: uid(), title: 'Management Meeting', type: 'meeting', startAt: todayAt(14), endAt: todayAt(15), project: 'Commercial Management', linkedMissionId: '', notes: '', createdAt: new Date().toISOString() },
      { id: uid(), title: 'Review & Approval', type: 'review', startAt: todayAt(16), endAt: todayAt(16, 30), project: 'Management Review', linkedMissionId: '', notes: '', createdAt: new Date().toISOString() }
    ];
    store.save(STORAGE_KEYS.events, events); return events;
  }

  function saveMissions() { store.save(STORAGE_KEYS.missions, missions); }
  function saveEvents() { store.save(STORAGE_KEYS.events, calendarEvents); }
  function savePreferences() { store.save(STORAGE_KEYS.preferences, preferences); }
  function saveCheckin() { store.save(STORAGE_KEYS.checkin, checkin); }
  function saveTimer() { store.save(STORAGE_KEYS.timer, timer); }

  function logActivity(action, entity, entityId, detail = '') {
    activityLog.unshift({ id: uid(), at: new Date().toISOString(), action, entity, entityId, detail });
    activityLog = activityLog.slice(0, 300);
    store.save(STORAGE_KEYS.activity, activityLog);
  }

  function deadlineScore(task) {
    const hours = (new Date(task.dueAt).getTime() - Date.now()) / 3_600_000;
    if (hours < 0) return 100; if (hours <= 6) return 95; if (hours <= 24) return 88; if (hours <= 48) return 75; if (hours <= 72) return 62; if (hours <= 168) return 42; return 20;
  }

  function cognitiveFit(task) {
    const diff = (ENERGY_ORDER[checkin.energy] || 2) - (ENERGY_ORDER[task.energyRequired] || 2);
    return diff >= 0 ? 100 : diff === -1 ? 55 : 20;
  }

  function timeFit(task) {
    const block = Number(checkin.currentBlock) || 30, effort = Number(task.effort) || 30;
    if (effort <= block) return 100; if (effort <= block * 1.5) return 72; if (effort <= block * 2) return 48; return 20;
  }

  function scoreTask(task) {
    const weighted = (IMPACT_SCORES[task.impact] ?? 50) * .25 + deadlineScore(task) * .20 + Number(task.consequence ?? 50) * .15 + Number(task.commitment ?? 50) * .10 + Number(task.unlock ?? 30) * .10 + Number(task.readiness ?? 100) * .10 + cognitiveFit(task) * .05 + timeFit(task) * .05;
    let adjusted = weighted;
    if (!task.nextAction?.trim()) adjusted -= 15;
    if (['Blocked', 'Waiting'].includes(task.status) || Number(task.readiness) <= 35) adjusted -= 45;
    if (task.status === 'Completed') adjusted = 0;
    return Math.max(0, Math.round(adjusted));
  }

  function taskHealth(task) {
    if (task.status === 'Completed') return 'Completed';
    if (task.status === 'Blocked') return 'Blocked';
    if (task.status === 'Waiting' || Number(task.readiness) <= 35) return 'Waiting';
    const hours = (new Date(task.dueAt).getTime() - Date.now()) / 3_600_000;
    if (hours < 0) return 'Overdue';
    if (hours <= 24 && scoreTask(task) >= 60) return 'At Risk';
    if (hours <= 48 && Number(task.progress || 0) < 30) return 'At Risk';
    return 'On Track';
  }

  function isActionable(task) {
    return !['Completed', 'Blocked', 'Waiting'].includes(task.status) && Number(task.readiness) > 35 && Boolean(task.nextAction?.trim());
  }

  function recommendedTask() {
    const overrideTask = manualOverride && missions.find(m => m.id === manualOverride.taskId && isActionable(m));
    if (overrideTask) return { task: overrideTask, overridden: true };
    const actionable = missions.filter(isActionable).sort((a, b) => scoreTask(b) - scoreTask(a));
    return { task: actionable[0] || null, overridden: false };
  }

  function recommendationReasons(task) {
    const reasons = [], dueHours = (new Date(task.dueAt).getTime() - Date.now()) / 3_600_000;
    if (task.impact === 'Critical') reasons.push(t('becauseCriticalImpact'));
    else if (task.impact === 'High') reasons.push(t('becauseHighImpact'));
    if (dueHours < 0) reasons.push(t('becauseOverdue'));
    else if (dueHours <= 8) reasons.push(t('becauseToday'));
    else if (dueHours <= 24) reasons.push(t('because24h'));
    if (Number(task.unlock) >= 80) reasons.push(t('becauseUnlocks'));
    if (Number(task.readiness) >= 90) reasons.push(t('becauseReady'));
    if (cognitiveFit(task) >= 90) reasons.push(t('becauseEnergy', { energy: enumText(checkin.energy) }));
    if (timeFit(task) >= 90) reasons.push(t('becauseTime', { minutes: checkin.currentBlock }));
    if (taskHealth(task) === 'At Risk') reasons.push(t('becauseRisk'));
    return reasons.slice(0, 4);
  }

  function priorityLabel(task) {
    const score = scoreTask(task); return score >= 85 ? 'Critical' : score >= 70 ? 'High' : score >= 50 ? 'Medium' : 'Low';
  }

  function classifyTask(task) {
    if (['Blocked', 'Waiting'].includes(task.status) || Number(task.readiness) <= 35) return 'wait';
    const dueHours = (new Date(task.dueAt).getTime() - Date.now()) / 3_600_000;
    if (dueHours <= 24 && scoreTask(task) >= 68) return 'must';
    if (['Deep Analysis', 'Creative / Writing', 'Review'].includes(task.focusType) && Number(task.effort) >= 45) return 'deep';
    if (Number(task.effort) <= 20) return ['Communication'].includes(task.focusType) ? 'coord' : 'quick';
    if (['Communication', 'Decision'].includes(task.focusType)) return 'coord';
    return 'deep';
  }

  function currentCalendarRange() {
    const mode = calendarState.mode, cursor = calendarState.cursor;
    if (mode === 'day') return [startOfDay(cursor), endOfDay(cursor)];
    if (mode === 'week') { const start = startOfWeek(cursor); return [start, endOfDay(addDays(start, 6))]; }
    if (mode === 'month') return [startOfMonth(cursor), endOfMonth(cursor)];
    const start = new Date(cursor.getFullYear(), 0, 1); return [start, new Date(cursor.getFullYear(), 11, 31, 23, 59, 59, 999)];
  }

  function calendarItems(start, end, includeDeadlines = true) {
    const items = [];
    calendarEvents.forEach(event => {
      const at = new Date(event.startAt);
      if (at >= start && at <= end) items.push({ ...event, kind: 'event', colorType: EVENT_COLORS[event.type] || 'meeting' });
    });
    missions.filter(m => m.status !== 'Completed').forEach(mission => {
      if (mission.scheduledStartAt) {
        const at = new Date(mission.scheduledStartAt);
        if (at >= start && at <= end) items.push({ id: `scheduled-${mission.id}`, missionId: mission.id, title: mission.title, startAt: mission.scheduledStartAt, endAt: mission.scheduledEndAt || new Date(at.getTime() + Number(mission.effort || 30) * 60000).toISOString(), kind: 'scheduled', colorType: mission.scheduleKind === 'coordination' ? 'coordination' : mission.scheduleKind === 'review' ? 'review' : 'focus', project: mission.project });
      }
      if (includeDeadlines) {
        const due = new Date(mission.dueAt);
        if (due >= start && due <= end) items.push({ id: `due-${mission.id}`, missionId: mission.id, title: mission.title, startAt: mission.dueAt, endAt: mission.dueAt, kind: 'deadline', colorType: 'deadline', project: mission.project });
      }
    });
    return items.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
  }

  function renderAll() {
    renderHeader(); renderMetrics(); renderRecommendation(); renderBoard(); renderAlerts(); renderWorkload(); renderTable(); renderTimer(); renderTodaySchedule();
    if (activeView === 'calendar') renderCalendar();
    applyLanguage();
  }

  function renderHeader() {
    const hour = new Date().getHours();
    el('greeting').textContent = t(hour < 12 ? 'goodMorning' : hour < 17 ? 'goodAfternoon' : 'goodEvening');
    el('today-date').textContent = new Intl.DateTimeFormat(locale(), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());
    el('checkin-time').textContent = checkin.updatedAt ? `${t('updated')} ${formatTime(checkin.updatedAt)}` : t('notCompletedToday');
  }

  function renderMetrics() {
    const active = missions.filter(m => m.status !== 'Completed');
    const overdue = active.filter(m => taskHealth(m) === 'Overdue').length, risk = active.filter(m => taskHealth(m) === 'At Risk').length;
    const todaysMeetings = calendarEvents.filter(e => e.type === 'meeting' && sameDay(e.startAt, new Date())).sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
    el('metric-focus').textContent = `${Number(checkin.availableHours).toFixed(1)} ${t('hoursShort')}`;
    el('metric-capacity').textContent = t('ofHours');
    el('metric-energy').textContent = enumText(checkin.energy);
    el('metric-energy-time').textContent = checkin.updatedAt ? `${t('updated')} ${formatTime(checkin.updatedAt)}` : t('updateCheckin');
    const meetingCard = el('metric-energy').closest('.metric-card').nextElementSibling;
    meetingCard.querySelector('strong').textContent = todaysMeetings.length;
    meetingCard.querySelector('small').textContent = todaysMeetings[0] ? `${t('next')}: ${formatTime(todaysMeetings[0].startAt)}` : t('noMeetings');
    el('metric-overdue').textContent = overdue; el('metric-risk').textContent = risk;
    el('notification-count').textContent = overdue + risk; el('notification-count').style.display = overdue + risk ? 'grid' : 'none';
  }

  function renderRecommendation() {
    const container = el('recommended-content'), { task, overridden } = recommendedTask();
    if (!task) {
      container.innerHTML = `<div class="empty-recommendation"><strong>${escapeHTML(t('noActionable'))}</strong>${escapeHTML(t('clarifyBlocker'))}</div>`; return;
    }
    const reasons = recommendationReasons(task), health = taskHealth(task);
    container.innerHTML = `<div class="rec-main">
      <div class="rec-visual"><svg><use href="#i-file-chart"/></svg></div>
      <div class="rec-info"><h4>${escapeHTML(task.title)}</h4><div class="tag-row">
        <span class="tag red">${escapeHTML(enumText(task.impact).toUpperCase())} ${escapeHTML(t('impactUpper').toUpperCase())}</span>
        <span class="tag blue">${escapeHTML(t('dueLabel').toUpperCase())} ${escapeHTML(formatDateTime(task.dueAt).toUpperCase())}</span>
        <span class="tag ${health === 'On Track' ? 'green' : 'amber'}">${escapeHTML(enumText(health).toUpperCase())}</span>
        ${overridden ? `<span class="tag amber">${escapeHTML(t('manualOverrideTag'))}</span>` : ''}</div>
        <div class="rec-details"><div class="detail-row"><span>${t('estimatedTime')}</span><strong>${task.effort} ${t('min')}</strong></div>
        <div class="detail-row"><span>${t('focusType')}</span><strong>${escapeHTML(enumText(task.focusType))}</strong></div>
        <div class="detail-row"><span>${t('priorityScore')}</span><strong>${scoreTask(task)} / 100</strong></div>
        <div class="detail-row"><span>${t('whyNow')}</span><strong>${escapeHTML(reasons.join(', ') || t('highestScore'))}</strong></div></div></div>
      <div class="outcome-box"><small>${escapeHTML(t('expectedOutcomeUpper'))}</small><p>${escapeHTML(task.outcome)}</p></div></div>
      <div class="rec-actions"><button class="primary-btn" data-rec-action="start" data-id="${task.id}">▶ ${t('startMission')}</button>
      <button class="secondary-btn" data-rec-action="schedule" data-id="${task.id}">▦ ${t('scheduleLater')}</button>
      <button class="secondary-btn" data-rec-action="blocked" data-id="${task.id}">⊘ ${t('markBlocked')}</button>
      <button class="secondary-btn" data-rec-action="steps" data-id="${task.id}">⌘ ${t('breakSteps')}</button>
      <button class="secondary-btn" data-rec-action="override" data-id="${task.id}">✎ ${t('override')}</button></div>`;
  }

  function filteredMissions() {
    let result = missions.filter(m => m.status !== 'Completed'); const filter = el('plan-filter')?.value || 'all';
    if (filter === 'mine') result = result.filter(m => m.owner.toLowerCase().includes('natthanaruk'));
    if (filter === 'overdue') result = result.filter(m => taskHealth(m) === 'Overdue');
    if (filter === 'risk') result = result.filter(m => taskHealth(m) === 'At Risk');
    if (searchTerm) { const term = searchTerm.toLowerCase(); result = result.filter(m => [m.title, m.project, m.owner, m.nextAction].some(v => String(v || '').toLowerCase().includes(term))); }
    return result;
  }

  function renderBoard() {
    const data = filteredMissions(); el('queue-count').textContent = `${t('missionQueue')} (${data.length})`;
    el('mission-board').innerHTML = COLUMN_CONFIG.map(column => {
      let tasks = data.filter(task => classifyTask(task) === column.id).sort((a, b) => scoreTask(b) - scoreTask(a));
      if (column.id === 'must') tasks = tasks.slice(0, 3);
      return `<section class="board-column ${column.className}"><h4>${t(column.titleKey)} (${tasks.length})</h4><div class="board-cards">${tasks.length ? tasks.slice(0, 4).map(renderMissionCard).join('') : `<div class="column-empty">${t('noMissions')}</div>`}</div><button class="add-column" data-action="open-intake">＋ ${t('addMission')}</button></section>`;
    }).join('');
  }

  function renderMissionCard(task) {
    const health = taskHealth(task), healthClass = health.toLowerCase().replaceAll(' ', '-');
    return `<article class="mission-card" data-edit-id="${task.id}"><h5>${escapeHTML(task.title)}</h5><div class="card-meta"><span>${escapeHTML(formatDateTime(task.dueAt))}</span><span>◷ ${task.effort} ${t('min')}</span></div><span class="card-health ${healthClass}">${escapeHTML(enumText(health))}</span></article>`;
  }

  function renderAlerts() {
    const overdue = missions.filter(m => taskHealth(m) === 'Overdue').length, risk = missions.filter(m => taskHealth(m) === 'At Risk').length, blocked = missions.filter(m => ['Blocked', 'Waiting'].includes(taskHealth(m))).length;
    const alerts = [
      { type: 'red', icon: '!', title: `${t('overdueAlert')} (${overdue})`, copy: t('needsAction'), filter: 'overdue' },
      { type: 'amber', icon: '△', title: `${t('riskAlert')} (${risk})`, copy: t('dueSoonRisk'), filter: 'risk' },
      { type: 'blue', icon: '×', title: `${t('blockedWaitingAlert')} (${blocked})`, copy: t('requiresFollowup'), filter: 'waiting' }
    ];
    el('alerts-list').innerHTML = alerts.map(a => `<div class="alert-item ${a.type}" data-alert-filter="${a.filter}"><span class="alert-icon">${a.icon}</span><div class="alert-copy"><strong>${escapeHTML(a.title)}</strong><small>${escapeHTML(a.copy)}</small></div><span class="alert-arrow">›</span></div>`).join('');
  }

  function renderWorkload() {
    const active = missions.filter(m => m.status !== 'Completed'), total = active.length;
    const counts = { 'On Track': active.filter(m => taskHealth(m) === 'On Track').length, 'At Risk': active.filter(m => taskHealth(m) === 'At Risk').length, Overdue: active.filter(m => taskHealth(m) === 'Overdue').length, Waiting: active.filter(m => ['Waiting', 'Blocked'].includes(taskHealth(m))).length };
    const colors = { 'On Track': '#1d9b5f', 'At Risk': '#df8a13', Overdue: '#e14848', Waiting: '#8390a3' };
    const parts = []; let start = 0;
    Object.entries(counts).forEach(([key, count]) => { const end = total ? start + count / total * 100 : start; parts.push(`${colors[key]} ${start}% ${end}%`); start = end; });
    el('workload-donut').style.background = total ? `conic-gradient(${parts.join(',')})` : '#e4eaf1';
    el('workload-total').textContent = total; el('workload-total-footer').textContent = total;
    const weekStart = startOfWeek(new Date());
    el('completed-week').textContent = missions.filter(m => m.status === 'Completed' && m.completedAt && new Date(m.completedAt) >= weekStart).length;
    el('workload-legend').innerHTML = Object.entries(counts).map(([key, count]) => `<div class="legend-row"><i class="legend-dot" style="background:${colors[key]}"></i><span>${enumText(key)}</span><strong>${count}${total ? ` (${Math.round(count / total * 100)}%)` : ''}</strong></div>`).join('');
  }

  function renderTable() {
    const body = el('mission-table-body'); if (!body) return;
    const term = (el('table-search')?.value || '').toLowerCase(), status = el('table-status-filter')?.value || 'all'; let data = [...missions];
    if (tableContext === 'my') data = data.filter(m => m.owner.toLowerCase().includes('natthanaruk'));
    if (tableContext === 'archive') data = data.filter(m => m.status === 'Completed'); else data = data.filter(m => m.status !== 'Completed');
    data.sort((a, b) => tableContext === 'calendar' ? new Date(a.dueAt) - new Date(b.dueAt) : scoreTask(b) - scoreTask(a));
    if (term) data = data.filter(m => [m.title, m.owner, m.project, m.nextAction].some(v => String(v || '').toLowerCase().includes(term)));
    if (status !== 'all') data = data.filter(m => m.status === status);
    body.innerHTML = data.length ? data.map(task => `<tr data-edit-id="${task.id}"><td class="table-title"><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(task.project || t('noWorkstream'))}</small></td><td>${escapeHTML(task.owner)}</td><td>${escapeHTML(formatDateTime(task.dueAt))}</td><td><span class="priority-pill ${priorityLabel(task).toLowerCase()}">${escapeHTML(enumText(priorityLabel(task)))}</span></td><td><span class="status-pill">${escapeHTML(enumText(task.status))}</span></td><td>${escapeHTML(enumText(taskHealth(task)))}</td><td><strong>${scoreTask(task)}</strong></td></tr>`).join('') : `<tr><td colspan="7" style="text-align:center;color:#718197;padding:30px">${t('noMissionsFound')}</td></tr>`;
  }

  function renderTodaySchedule() {
    const start = startOfDay(new Date()), end = endOfDay(new Date());
    const items = calendarItems(start, end, false).filter(item => item.kind !== 'deadline');
    el('today-schedule-list').innerHTML = items.length ? items.slice(0, 6).map(item => `<button class="schedule-item ${item.colorType}" ${item.kind === 'event' ? `data-event-id="${item.id}"` : `data-calendar-mission-id="${item.missionId}"`}><span>${formatTime(item.startAt)} – ${formatTime(item.endAt)}</span><strong>${escapeHTML(item.title)}</strong></button>`).join('') : `<div class="schedule-empty">${t('nothingScheduled')}</div>`;
  }

  function renderCalendar() {
    const [start, end] = currentCalendarRange();
    el('calendar-range').textContent = formatRange(start, end, calendarState.mode);
    qsa('[data-calendar-mode]').forEach(button => button.classList.toggle('active', button.dataset.calendarMode === calendarState.mode));
    const renderers = { day: renderDayCalendar, week: renderWeekCalendar, month: renderMonthCalendar, year: renderYearCalendar };
    el('calendar-canvas').innerHTML = renderers[calendarState.mode](start, end);
    renderUnscheduledMissions(); renderCalendarStats(start, end);
  }

  function calendarItemHTML(item, compact = false) {
    const attrs = item.kind === 'event' ? `data-event-id="${item.id}"` : `data-calendar-mission-id="${item.missionId}"`;
    const label = item.kind === 'deadline' ? t('dueLabel') : `${formatTime(item.startAt)}${compact ? '' : `–${formatTime(item.endAt)}`}`;
    return `<button class="calendar-item ${item.colorType} ${compact ? 'compact' : ''}" ${attrs} title="${escapeHTML(item.title)}"><span>${escapeHTML(label)}</span><strong>${escapeHTML(item.title)}</strong></button>`;
  }

  function renderDayCalendar(start, end) {
    const items = calendarItems(start, end);
    const deadlineItems = items.filter(i => i.kind === 'deadline');
    const rows = [];
    for (let hour = Number(preferences.workdayStart); hour <= Number(preferences.workdayEnd); hour += 1) {
      const slot = new Date(start); slot.setHours(hour, 0, 0, 0);
      const slotItems = items.filter(i => i.kind !== 'deadline' && new Date(i.startAt).getHours() === hour);
      rows.push(`<div class="day-hour-row"><time>${String(hour).padStart(2, '0')}:00</time><div class="day-hour-slot" data-calendar-date="${toDateTimeLocal(slot)}">${slotItems.map(i => calendarItemHTML(i)).join('')}</div></div>`);
    }
    return `<div class="calendar-day"><div class="all-day-row"><span>${t('deadlines')}</span><div>${deadlineItems.length ? deadlineItems.map(i => calendarItemHTML(i, true)).join('') : `<em>${t('calendarEmpty')}</em>`}</div></div>${rows.join('')}</div>`;
  }

  function renderWeekCalendar(start) {
    const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));
    const allItems = calendarItems(start, endOfDay(days[6]));
    let html = '<div class="week-grid"><div class="week-corner"></div>';
    days.forEach(day => { html += `<div class="week-day-head ${sameDay(day, new Date()) ? 'today' : ''}"><span>${new Intl.DateTimeFormat(locale(), { weekday: 'short' }).format(day)}</span><strong>${day.getDate()}</strong></div>`; });
    for (let hour = Number(preferences.workdayStart); hour <= Number(preferences.workdayEnd); hour += 1) {
      html += `<div class="week-time">${String(hour).padStart(2, '0')}:00</div>`;
      days.forEach(day => {
        const slot = new Date(day); slot.setHours(hour, 0, 0, 0);
        const items = allItems.filter(i => sameDay(i.startAt, day) && (i.kind === 'deadline' ? hour === Number(preferences.workdayStart) : new Date(i.startAt).getHours() === hour));
        html += `<div class="week-cell ${sameDay(day, new Date()) ? 'today' : ''}" data-calendar-date="${toDateTimeLocal(slot)}">${items.map(i => calendarItemHTML(i, true)).join('')}</div>`;
      });
    }
    return `${html}</div>`;
  }

  function renderMonthCalendar(start) {
    const gridStart = startOfWeek(start), days = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
    const rangeEnd = endOfDay(days[41]), items = calendarItems(gridStart, rangeEnd);
    const weekdayHeads = Array.from({ length: 7 }, (_, index) => addDays(gridStart, index)).map(day => `<div class="month-weekday">${new Intl.DateTimeFormat(locale(), { weekday: 'short' }).format(day)}</div>`).join('');
    const cells = days.map(day => {
      const dayItems = items.filter(i => sameDay(i.startAt, day));
      const shown = dayItems.slice(0, 4), more = dayItems.length - shown.length;
      return `<div class="month-cell ${day.getMonth() !== start.getMonth() ? 'outside' : ''} ${sameDay(day, new Date()) ? 'today' : ''}" data-calendar-date="${toDateTimeLocal(new Date(day.setHours(9, 0, 0, 0)))}"><div class="month-date">${day.getDate()}</div>${shown.map(i => calendarItemHTML(i, true)).join('')}${more > 0 ? `<button class="month-more" data-calendar-day="${dateKey(day)}">+${more} ${t('more')}</button>` : ''}</div>`;
    }).join('');
    return `<div class="month-grid">${weekdayHeads}${cells}</div>`;
  }

  function renderYearCalendar(start) {
    const year = start.getFullYear();
    return `<div class="year-grid">${Array.from({ length: 12 }, (_, month) => {
      const first = new Date(year, month, 1), last = endOfMonth(first), items = calendarItems(first, last);
      const deadlineCount = items.filter(i => i.kind === 'deadline').length, eventCount = items.filter(i => i.kind !== 'deadline').length;
      const weekdays = Array.from({ length: 7 }, (_, i) => `<span>${new Intl.DateTimeFormat(locale(), { weekday: 'narrow' }).format(addDays(startOfWeek(first), i))}</span>`).join('');
      const blanks = (first.getDay() + 6) % 7;
      const days = `${'<i></i>'.repeat(blanks)}${Array.from({ length: last.getDate() }, (_, i) => {
        const day = new Date(year, month, i + 1), count = calendarItems(startOfDay(day), endOfDay(day)).length;
        return `<b class="${count ? `load-${Math.min(3, count)}` : ''} ${sameDay(day, new Date()) ? 'today' : ''}">${i + 1}</b>`;
      }).join('')}`;
      return `<button class="year-month" data-year-month="${month}"><strong>${new Intl.DateTimeFormat(locale(), { month: 'long' }).format(first)}</strong><div class="mini-weekdays">${weekdays}</div><div class="mini-month-days">${days}</div><small>${deadlineCount + eventCount} ${t('monthSummary')}</small></button>`;
    }).join('')}</div>`;
  }

  function renderUnscheduledMissions() {
    const data = missions.filter(m => m.status !== 'Completed' && !m.scheduledStartAt).sort((a, b) => scoreTask(b) - scoreTask(a));
    el('unscheduled-count').textContent = String(data.length);
    el('unscheduled-list').innerHTML = data.length ? data.slice(0, 10).map(m => `<article class="unscheduled-card"><div><strong>${escapeHTML(m.title)}</strong><small>${escapeHTML(formatDateTime(m.dueAt))} · ${scoreTask(m)}</small></div><button class="secondary-btn" data-schedule-id="${m.id}">${t('schedule')}</button></article>`).join('') : `<div class="calendar-empty-state">${t('noUnscheduled')}</div>`;
  }

  function renderCalendarStats(start, end) {
    const items = calendarItems(start, end), scheduled = items.filter(i => i.kind === 'scheduled'), events = items.filter(i => i.kind === 'event');
    const plannedMinutes = scheduled.reduce((sum, i) => sum + Math.max(0, (new Date(i.endAt) - new Date(i.startAt)) / 60000), 0) + events.filter(i => i.type === 'focus').reduce((sum, i) => sum + Math.max(0, (new Date(i.endAt) - new Date(i.startAt)) / 60000), 0);
    const rows = [
      [t('plannedHours'), `${(plannedMinutes / 60).toFixed(1)} ${t('hoursShort')}`], [t('focusBlocks'), scheduled.length + events.filter(i => i.type === 'focus').length],
      [t('meetings'), events.filter(i => i.type === 'meeting').length], [t('deadlines'), items.filter(i => i.kind === 'deadline').length], [t('visiblePeriod'), formatRange(start, end, calendarState.mode)]
    ];
    el('calendar-stats').innerHTML = rows.map(([label, value]) => `<div><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></div>`).join('');
  }

  function openMissionModal(taskId = null) {
    const task = missions.find(m => m.id === taskId); el('mission-modal-title').textContent = task ? t('editMission') : t('createMission');
    el('mission-id').value = task?.id || ''; el('mission-title').value = task?.title || ''; el('mission-outcome').value = task?.outcome || ''; el('mission-owner').value = task?.owner || 'Natthanaruk'; el('mission-project').value = task?.project || '';
    el('mission-due').value = task ? toDateTimeLocal(task.dueAt) : toDateTimeLocal(todayAt(17)); el('mission-effort').value = String(task?.effort || 60); el('mission-impact').value = task?.impact || 'High';
    el('mission-consequence').value = String(task?.consequence || 55); el('mission-commitment').value = String(task?.commitment || 70); el('mission-unlock').value = String(task?.unlock || 30); el('mission-focus').value = task?.focusType || 'Deep Analysis';
    el('mission-energy').value = task?.energyRequired || 'Medium'; el('mission-readiness').value = String(task?.readiness ?? 100); el('mission-status').value = task?.status || 'Not Started'; el('mission-next').value = task?.nextAction || ''; el('mission-blocker').value = task?.blocker || '';
    el('delete-mission').classList.toggle('hidden', !task); openModal('mission-modal'); applyLanguage();
  }

  function openCheckinModal() {
    qsa('input[name="energy"]').forEach(input => input.checked = input.value === checkin.energy); el('checkin-hours').value = checkin.availableHours; el('checkin-block').value = checkin.currentBlock; el('checkin-interruptions').value = checkin.interruptions; el('checkin-outcome').value = checkin.mainOutcome || ''; openModal('checkin-modal'); applyLanguage();
  }

  function openOverrideModal() {
    const actionable = missions.filter(isActionable).sort((a, b) => scoreTask(b) - scoreTask(a));
    el('override-mission').innerHTML = actionable.map(m => `<option value="${m.id}">${escapeHTML(m.title)} — ${t('scoreWord')} ${scoreTask(m)}</option>`).join(''); openModal('override-modal'); applyLanguage();
  }

  function openEventModal(eventId = null, suggestedStart = null) {
    const event = calendarEvents.find(item => item.id === eventId); const start = event ? new Date(event.startAt) : suggestedStart ? new Date(suggestedStart) : nextRoundedHour(); const end = event ? new Date(event.endAt) : new Date(start.getTime() + 60 * 60000);
    el('event-modal-title').textContent = event ? t('editCalendarEvent') : t('addCalendarEvent'); el('event-id').value = event?.id || ''; el('event-title').value = event?.title || ''; el('event-type').value = event?.type || 'meeting'; el('event-project').value = event?.project || '';
    el('event-start').value = toDateTimeLocal(start); el('event-end').value = toDateTimeLocal(end); el('event-mission').innerHTML = `<option value="">${t('noLinkedMission')}</option>${missions.filter(m => m.status !== 'Completed').map(m => `<option value="${m.id}">${escapeHTML(m.title)}</option>`).join('')}`;
    el('event-mission').value = event?.linkedMissionId || ''; el('event-notes').value = event?.notes || ''; el('delete-event').classList.toggle('hidden', !event); openModal('event-modal'); applyLanguage();
  }

  function openScheduleModal(taskId, suggestedStart = null) {
    const task = missions.find(m => m.id === taskId); if (!task) return;
    const start = suggestedStart ? new Date(suggestedStart) : task.scheduledStartAt ? new Date(task.scheduledStartAt) : nextRoundedHour();
    el('schedule-mission-id').value = task.id; el('schedule-mission-name').textContent = task.title; el('schedule-start').value = toDateTimeLocal(start); el('schedule-duration').value = String(Math.min(120, Number(task.effort || 60))); el('schedule-kind').value = task.scheduleKind || (task.focusType === 'Communication' ? 'coordination' : task.focusType === 'Review' || task.focusType === 'Decision' ? 'review' : 'focus'); openModal('schedule-modal'); applyLanguage();
  }

  function openSettingsModal() {
    el('setting-language').value = preferences.language; el('setting-calendar-view').value = preferences.calendarView; el('setting-work-start').value = String(preferences.workdayStart); el('setting-work-end').value = String(preferences.workdayEnd); openModal('settings-modal'); applyLanguage();
  }

  function nextRoundedHour() {
    const d = new Date(); d.setMinutes(d.getMinutes() < 30 ? 30 : 0, 0, 0); if (d.getMinutes() === 0) d.setHours(d.getHours() + 1); return d;
  }

  function openModal(id) { el('modal-backdrop').classList.remove('hidden'); el(id).classList.remove('hidden'); }
  function closeModals() { el('modal-backdrop').classList.add('hidden'); qsa('.modal').forEach(modal => modal.classList.add('hidden')); }

  function handleMissionSubmit(event) {
    event.preventDefault(); const id = el('mission-id').value, old = missions.find(m => m.id === id), readiness = Number(el('mission-readiness').value); let status = el('mission-status').value;
    if (readiness === 0 && status !== 'Completed') status = 'Blocked'; if (readiness === 35 && status === 'Not Started') status = 'Waiting';
    const dueDate = new Date(el('mission-due').value); if (Number.isNaN(dueDate.getTime())) return toast(t('invalidDate'));
    const payload = { id: id || uid(), title: el('mission-title').value.trim(), outcome: el('mission-outcome').value.trim(), owner: el('mission-owner').value.trim(), project: el('mission-project').value.trim(), dueAt: dueDate.toISOString(), effort: Number(el('mission-effort').value), impact: el('mission-impact').value, consequence: Number(el('mission-consequence').value), commitment: Number(el('mission-commitment').value), unlock: Number(el('mission-unlock').value), focusType: el('mission-focus').value, energyRequired: el('mission-energy').value, readiness, status, nextAction: el('mission-next').value.trim(), blocker: el('mission-blocker').value.trim(), progress: old?.progress || 0, steps: old?.steps || [], scheduledStartAt: old?.scheduledStartAt || null, scheduledEndAt: old?.scheduledEndAt || null, scheduleKind: old?.scheduleKind || null, completedAt: status === 'Completed' ? old?.completedAt || new Date().toISOString() : null, createdAt: old?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
    missions = id ? missions.map(m => m.id === id ? payload : m) : [...missions, payload]; saveMissions(); logActivity(id ? 'update' : 'create', 'mission', payload.id, payload.title); clearOverride(); closeModals(); renderAll(); toast(t(id ? 'missionUpdated' : 'missionCreated'));
  }

  function deleteCurrentMission() {
    const id = el('mission-id').value; if (!id || !confirm(t('confirmDeleteMission'))) return; const task = missions.find(m => m.id === id); missions = missions.filter(m => m.id !== id); calendarEvents = calendarEvents.filter(e => e.linkedMissionId !== id); saveMissions(); saveEvents(); logActivity('delete', 'mission', id, task?.title || ''); if (manualOverride?.taskId === id) clearOverride(); closeModals(); renderAll(); toast(t('missionDeleted'));
  }

  function handleCheckinSubmit(event) {
    event.preventDefault(); checkin = { energy: document.querySelector('input[name="energy"]:checked').value, availableHours: Number(el('checkin-hours').value), currentBlock: Number(el('checkin-block').value), interruptions: el('checkin-interruptions').value, mainOutcome: el('checkin-outcome').value.trim(), updatedAt: new Date().toISOString() };
    saveCheckin(); logActivity('update', 'checkin', dateKey(new Date()), checkin.energy); clearOverride(); closeModals(); renderAll(); toast(t('recommendationUpdated'));
  }

  function handleOverrideSubmit(event) {
    event.preventDefault(); manualOverride = { taskId: el('override-mission').value, reason: el('override-reason').value, at: new Date().toISOString() }; store.save(STORAGE_KEYS.override, manualOverride); logActivity('override', 'recommendation', manualOverride.taskId, manualOverride.reason); closeModals(); renderRecommendation(); applyLanguage(); toast(t('overrideRecorded'));
  }

  function handleEventSubmit(event) {
    event.preventDefault(); const id = el('event-id').value, old = calendarEvents.find(item => item.id === id), start = new Date(el('event-start').value), end = new Date(el('event-end').value);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return toast(t('invalidDate'));
    const payload = { id: id || uid(), title: el('event-title').value.trim(), type: el('event-type').value, project: el('event-project').value.trim(), startAt: start.toISOString(), endAt: end.toISOString(), linkedMissionId: el('event-mission').value, notes: el('event-notes').value.trim(), createdAt: old?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
    calendarEvents = id ? calendarEvents.map(item => item.id === id ? payload : item) : [...calendarEvents, payload]; saveEvents(); logActivity(id ? 'update' : 'create', 'event', payload.id, payload.title); closeModals(); renderAll(); toast(t(id ? 'eventUpdated' : 'eventCreated'));
  }

  function deleteCurrentEvent() {
    const id = el('event-id').value; if (!id || !confirm(t('confirmDeleteEvent'))) return; const event = calendarEvents.find(item => item.id === id); calendarEvents = calendarEvents.filter(item => item.id !== id); saveEvents(); logActivity('delete', 'event', id, event?.title || ''); closeModals(); renderAll(); toast(t('eventDeleted'));
  }

  function handleScheduleSubmit(event) {
    event.preventDefault(); const taskId = el('schedule-mission-id').value, start = new Date(el('schedule-start').value), duration = Number(el('schedule-duration').value);
    if (Number.isNaN(start.getTime())) return toast(t('invalidDate')); const end = new Date(start.getTime() + duration * 60000);
    missions = missions.map(m => m.id === taskId ? { ...m, scheduledStartAt: start.toISOString(), scheduledEndAt: end.toISOString(), scheduleKind: el('schedule-kind').value, updatedAt: new Date().toISOString() } : m); saveMissions(); logActivity('schedule', 'mission', taskId, start.toISOString()); closeModals(); renderAll(); toast(t('missionScheduled'));
  }

  function handleSettingsSubmit(event) {
    event.preventDefault(); preferences = { ...preferences, language: el('setting-language').value, calendarView: el('setting-calendar-view').value, workdayStart: Number(el('setting-work-start').value), workdayEnd: Number(el('setting-work-end').value) };
    if (preferences.workdayEnd <= preferences.workdayStart) preferences.workdayEnd = preferences.workdayStart + 8;
    calendarState.mode = preferences.calendarView; savePreferences(); logActivity('update', 'settings', 'preferences', preferences.language); closeModals(); renderAll(); toast(t('settingsSaved'));
  }

  function handleRecommendationAction(action, taskId) {
    const task = missions.find(m => m.id === taskId); if (!task) return;
    if (action === 'start') startMission(task); if (action === 'schedule') openScheduleModal(task.id); if (action === 'blocked') markBlocked(task); if (action === 'steps') breakIntoSteps(task); if (action === 'override') openOverrideModal();
  }

  function startMission(task) {
    missions = missions.map(m => m.id === task.id ? { ...m, status: 'In Progress', updatedAt: new Date().toISOString() } : m); saveMissions(); timer = { taskId: task.id, remaining: Math.min(Number(task.effort), Number(checkin.currentBlock)) * 60, running: true, lastTick: Date.now() }; saveTimer(); logActivity('start', 'mission', task.id, task.title); startTimerInterval(); renderAll(); el('focus-timer-section').scrollIntoView({ behavior: 'smooth', block: 'center' }); toast(`${t('focusStarted')}: ${task.title}`);
  }

  function markBlocked(task) {
    const reason = prompt(t('enterBlocker'), task.blocker || ''); if (reason === null) return;
    missions = missions.map(m => m.id === task.id ? { ...m, status: 'Blocked', readiness: 0, blocker: reason.trim() || t('blocked'), updatedAt: new Date().toISOString() } : m); saveMissions(); logActivity('block', 'mission', task.id, reason); clearOverride(); renderAll(); toast(t('missionBlocked'));
  }

  function breakIntoSteps(task) {
    const raw = prompt(t('enterSteps'), task.steps?.join('; ') || ''); if (!raw) return; const steps = raw.split(';').map(s => s.trim()).filter(Boolean);
    missions = missions.map(m => m.id === task.id ? { ...m, steps, nextAction: steps[0] || m.nextAction, effort: Math.max(15, Math.round(Number(m.effort) / Math.max(1, steps.length))), updatedAt: new Date().toISOString() } : m); saveMissions(); logActivity('steps', 'mission', task.id, String(steps.length)); renderAll(); toast(`${steps.length} ${t('executionSteps')}`);
  }

  function clearOverride() { manualOverride = null; localStorage.removeItem(STORAGE_KEYS.override); }

  function startTimerInterval() {
    clearInterval(timerInterval); if (!timer.running) return;
    timerInterval = setInterval(() => {
      const now = Date.now(), elapsed = Math.max(1, Math.floor((now - (timer.lastTick || now)) / 1000)); timer.remaining = Math.max(0, timer.remaining - elapsed); timer.lastTick = now;
      if (timer.remaining <= 0) { timer.running = false; clearInterval(timerInterval); toast(t('focusComplete')); }
      saveTimer(); renderTimer();
    }, 1000);
  }

  function renderTimer() {
    const task = missions.find(m => m.id === timer.taskId), minutes = Math.floor((timer.remaining || 0) / 60), seconds = Math.max(0, timer.remaining || 0) % 60;
    el('timer-display').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    el('timer-state').textContent = timer.running ? enumText('In Progress') : task ? t('pause') : t('notRunning');
    el('timer-task').textContent = task ? task.title : t('startMissionTimer'); el('timer-pause').disabled = !task; el('timer-complete').disabled = !task; el('timer-pause').textContent = timer.running ? t('pause') : t('resume'); el('timer-complete').textContent = t('complete');
  }

  function toggleTimer() { if (!timer.taskId) return; timer.running = !timer.running; timer.lastTick = Date.now(); saveTimer(); if (timer.running) startTimerInterval(); else clearInterval(timerInterval); renderTimer(); }

  function completeTimerTask() {
    const task = missions.find(m => m.id === timer.taskId); if (!task) return;
    missions = missions.map(m => m.id === task.id ? { ...m, status: 'Completed', progress: 100, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : m); saveMissions(); logActivity('complete', 'mission', task.id, task.title); timer = { taskId: null, remaining: 0, running: false, lastTick: null }; saveTimer(); clearInterval(timerInterval); clearOverride(); renderAll(); toast(t('missionAccomplished'));
  }

  function switchView(view) {
    activeView = view; qsa('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === view));
    el('today-view').classList.remove('active-view'); el('calendar-view').classList.remove('active-view'); el('generic-view').classList.remove('active-view');
    if (view === 'today') { el('today-view').classList.add('active-view'); el('page-title').textContent = t('todayCommandCenter'); renderAll(); return; }
    if (view === 'calendar') { el('calendar-view').classList.add('active-view'); el('page-title').textContent = t('calendar'); renderCalendar(); applyLanguage(); return; }
    tableContext = view; el('generic-view').classList.add('active-view'); const [titleKey, descKey] = viewMeta[view] || viewMeta.queue; el('page-title').textContent = t(titleKey); el('generic-title').textContent = t(titleKey); el('generic-description').textContent = t(descKey); renderTable(); applyLanguage();
  }

  function moveCalendar(direction) {
    const mode = calendarState.mode;
    calendarState.cursor = mode === 'day' ? addDays(calendarState.cursor, direction) : mode === 'week' ? addDays(calendarState.cursor, direction * 7) : mode === 'month' ? addMonths(calendarState.cursor, direction) : addYears(calendarState.cursor, direction); renderCalendar(); applyLanguage();
  }

  function toggleLanguage() {
    preferences.language = preferences.language === 'th' ? 'en' : 'th'; savePreferences(); renderAll(); switchView(activeView);
  }

  function exportData() {
    const payload = { schemaVersion: 2, exportedAt: new Date().toISOString(), missions, calendarEvents, checkin, preferences, activityLog };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), anchor = document.createElement('a');
    anchor.href = url; anchor.download = `mission-control-backup-${dateKey(new Date())}.json`; anchor.click(); URL.revokeObjectURL(url); toast(t('dataExported'));
  }

  async function importData(file) {
    try {
      const payload = JSON.parse(await file.text()); if (!Array.isArray(payload.missions) || !Array.isArray(payload.calendarEvents)) throw new Error('Invalid schema');
      missions = payload.missions; calendarEvents = payload.calendarEvents; checkin = payload.checkin || checkin; preferences = { ...preferences, ...(payload.preferences || {}) }; activityLog = Array.isArray(payload.activityLog) ? payload.activityLog : activityLog;
      saveMissions(); saveEvents(); saveCheckin(); savePreferences(); store.save(STORAGE_KEYS.activity, activityLog); calendarState.mode = preferences.calendarView || 'week'; closeModals(); renderAll(); toast(t('dataImported'));
    } catch (error) { console.error(error); toast(t('invalidBackup')); }
  }

  function applyLanguage() {
    document.documentElement.lang = preferences.language;
    const textMap = new Map();
    Object.keys(I18N.en).forEach(key => { textMap.set(I18N.en[key], { type: 'key', key }); textMap.set(I18N.th[key], { type: 'key', key }); });
    EXTRA_TRANSLATIONS.forEach(([en, th]) => { const entry = { type: 'pair', en, th }; textMap.set(en, entry); textMap.set(th, entry); });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.parentElement || node.parentElement.closest('[data-dynamic="true"], script, style')) continue;
      const raw = node.nodeValue, trimmed = raw.trim(), entry = textMap.get(trimmed);
      if (entry) {
        const translated = entry.type === 'key' ? t(entry.key) : entry[preferences.language];
        node.nodeValue = raw.replace(trimmed, translated);
      }
    }
    const placeholderMap = {
      'Search missions, projects, owners or next actions…': 'searchMissionsPlaceholder', 'ค้นหาภารกิจ โครงการ ผู้รับผิดชอบ หรือ Next Action…': 'searchMissionsPlaceholder',
      'Search this view…': 'searchThisViewPlaceholder', 'ค้นหาในมุมมองนี้…': 'searchThisViewPlaceholder',
      'e.g. Finalize July AR Provision Review': 'missionTitlePlaceholder', 'เช่น สรุป AR Provision เดือนกรกฎาคม': 'missionTitlePlaceholder',
      'What must be true when this mission is complete?': 'outcomePlaceholder', 'เมื่อภารกิจเสร็จ ต้องมีผลลัพธ์อะไรเกิดขึ้น?': 'outcomePlaceholder',
      'e.g. Monthly Management Pack': 'projectPlaceholder', 'เช่น Monthly Management Pack': 'projectPlaceholder',
      'The exact next physical action': 'nextActionPlaceholder', 'การดำเนินการถัดไปที่ชัดเจนและลงมือได้': 'nextActionPlaceholder',
      'Leave blank if ready': 'blockerPlaceholder', 'เว้นว่างหากพร้อมดำเนินการ': 'blockerPlaceholder',
      'One outcome that would make today successful': 'mainOutcomePlaceholder', 'หนึ่งผลลัพธ์ที่ทำให้วันนี้ถือว่าสำเร็จ': 'mainOutcomePlaceholder',
      'e.g. Management Review': 'eventTitlePlaceholder', 'เช่น Management Review': 'eventTitlePlaceholder',
      'Optional': 'optional', 'ไม่บังคับ': 'optional', 'Agenda, location or preparation note': 'notesPlaceholder', 'วาระ สถานที่ หรือสิ่งที่ต้องเตรียม': 'notesPlaceholder'
    };
    qsa('[placeholder]').forEach(input => { const key = placeholderMap[input.placeholder]; if (key) input.placeholder = t(key); });
    const languageToggle = el('language-toggle'); if (languageToggle) languageToggle.innerHTML = `<span class="${preferences.language === 'th' ? 'lang-active' : ''}">TH</span><span class="${preferences.language === 'en' ? 'lang-active' : ''}">EN</span>`;
    qsa('[data-dynamic-target]').forEach(node => node.dataset.dynamic = 'true');
  }

  function toast(message) { const node = el('toast'); node.textContent = message; node.classList.remove('hidden'); clearTimeout(node._timeout); node._timeout = setTimeout(() => node.classList.add('hidden'), 2800); }
  function escapeHTML(value) { return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }

  function initEvents() {
    document.addEventListener('click', event => {
      const actionNode = event.target.closest('[data-action]');
      if (actionNode) {
        const action = actionNode.dataset.action;
        if (action === 'open-intake') openMissionModal(); if (action === 'open-checkin') openCheckinModal(); if (action === 'scroll-timer') el('focus-timer-section').scrollIntoView({ behavior: 'smooth', block: 'center' }); if (action === 'open-settings') openSettingsModal();
      }
      const viewNode = event.target.closest('[data-view]'); if (viewNode) switchView(viewNode.dataset.view);
      const editNode = event.target.closest('[data-edit-id]'); if (editNode) openMissionModal(editNode.dataset.editId);
      const recNode = event.target.closest('[data-rec-action]'); if (recNode) handleRecommendationAction(recNode.dataset.recAction, recNode.dataset.id);
      const alertNode = event.target.closest('[data-alert-filter]'); if (alertNode) { const map = { overdue: 'overdue', risk: 'risk', waiting: 'all' }; el('plan-filter').value = map[alertNode.dataset.alertFilter] || 'all'; renderBoard(); document.querySelector('.today-plan-panel').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      const eventNode = event.target.closest('[data-event-id]'); if (eventNode) openEventModal(eventNode.dataset.eventId);
      const missionCalendarNode = event.target.closest('[data-calendar-mission-id]'); if (missionCalendarNode) openMissionModal(missionCalendarNode.dataset.calendarMissionId);
      const scheduleNode = event.target.closest('[data-schedule-id]'); if (scheduleNode) openScheduleModal(scheduleNode.dataset.scheduleId);
      const slotNode = event.target.closest('[data-calendar-date]'); if (slotNode && !event.target.closest('.calendar-item')) openEventModal(null, new Date(slotNode.dataset.calendarDate));
      const yearMonth = event.target.closest('[data-year-month]'); if (yearMonth) { calendarState.cursor = new Date(calendarState.cursor.getFullYear(), Number(yearMonth.dataset.yearMonth), 1); calendarState.mode = 'month'; renderCalendar(); applyLanguage(); }
      const calendarDay = event.target.closest('[data-calendar-day]'); if (calendarDay) { calendarState.cursor = new Date(`${calendarDay.dataset.calendarDay}T09:00:00`); calendarState.mode = 'day'; renderCalendar(); applyLanguage(); }
      const modeNode = event.target.closest('[data-calendar-mode]'); if (modeNode) { calendarState.mode = modeNode.dataset.calendarMode; preferences.calendarView = calendarState.mode; savePreferences(); renderCalendar(); applyLanguage(); }
      if (event.target.closest('[data-close-modal]') || event.target.id === 'modal-backdrop') closeModals();
    });

    el('mission-form').addEventListener('submit', handleMissionSubmit); el('checkin-form').addEventListener('submit', handleCheckinSubmit); el('override-form').addEventListener('submit', handleOverrideSubmit); el('event-form').addEventListener('submit', handleEventSubmit); el('schedule-form').addEventListener('submit', handleScheduleSubmit); el('settings-form').addEventListener('submit', handleSettingsSubmit);
    el('delete-mission').addEventListener('click', deleteCurrentMission); el('delete-event').addEventListener('click', deleteCurrentEvent); el('plan-filter').addEventListener('change', renderBoard); el('view-all-btn').addEventListener('click', () => switchView('queue')); el('view-alerts').addEventListener('click', () => switchView('queue'));
    el('refresh-recommendation').addEventListener('click', () => { clearOverride(); renderRecommendation(); applyLanguage(); toast(t('recommendationRecalculated')); });
    el('search-toggle').addEventListener('click', () => { el('search-panel').classList.toggle('hidden'); if (!el('search-panel').classList.contains('hidden')) el('global-search').focus(); });
    el('global-search').addEventListener('input', event => { searchTerm = event.target.value.trim(); renderBoard(); }); el('clear-search').addEventListener('click', () => { searchTerm = ''; el('global-search').value = ''; renderBoard(); });
    el('table-search').addEventListener('input', renderTable); el('table-status-filter').addEventListener('change', renderTable); el('timer-pause').addEventListener('click', toggleTimer); el('timer-complete').addEventListener('click', completeTimerTask);
    el('notification-btn').addEventListener('click', () => document.querySelector('.alerts-panel').scrollIntoView({ behavior: 'smooth', block: 'center' })); el('help-btn').addEventListener('click', () => toast('Business Priority × Deadline × Readiness × Focus Fit × Time Fit'));
    el('language-toggle').addEventListener('click', toggleLanguage);
    el('mobile-menu')?.addEventListener('click', () => { el('sidebar').classList.add('open'); el('sidebar-scrim').classList.add('show'); });
    const closeSidebar = () => { el('sidebar').classList.remove('open'); el('sidebar-scrim').classList.remove('show'); };
    el('sidebar-close')?.addEventListener('click', closeSidebar); el('sidebar-scrim')?.addEventListener('click', closeSidebar);
    qsa('.nav-item').forEach(button => button.addEventListener('click', () => { if (window.innerWidth <= 860) closeSidebar(); }));
    el('calendar-prev').addEventListener('click', () => moveCalendar(-1)); el('calendar-next').addEventListener('click', () => moveCalendar(1)); el('calendar-today').addEventListener('click', () => { calendarState.cursor = startOfDay(new Date()); renderCalendar(); applyLanguage(); }); el('add-calendar-event').addEventListener('click', () => openEventModal());
    el('export-data').addEventListener('click', exportData); el('import-data').addEventListener('click', () => el('import-file').click()); el('import-file').addEventListener('change', event => { const [file] = event.target.files; if (file) importData(file); event.target.value = ''; });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModals(); });
  }

  function markDynamicContainers() {
    ['recommended-content', 'mission-board', 'alerts-list', 'workload-legend', 'mission-table-body', 'today-schedule-list', 'calendar-canvas', 'unscheduled-list', 'calendar-stats', 'timer-task', 'greeting', 'today-date', 'checkin-time', 'calendar-range'].forEach(id => { if (el(id)) el(id).dataset.dynamic = 'true'; });
  }

  function init() {
    markDynamicContainers(); initEvents();
    if (timer.running) { const elapsed = Math.floor((Date.now() - (timer.lastTick || Date.now())) / 1000); timer.remaining = Math.max(0, timer.remaining - elapsed); timer.lastTick = Date.now(); if (timer.remaining > 0) startTimerInterval(); else timer.running = false; }
    renderAll(); switchView('today');
  }

  init();
})();
