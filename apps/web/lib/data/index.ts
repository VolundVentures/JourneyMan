// Re-export all data fetching functions
export {
  getEmployees,
  getEmployee,
  getEmployeeTasks,
  getEmployeePerformance,
  getEmployeeMemories,
} from './employees';

export {
  getDashboardStats,
  getRecentActivity,
  getAllTasks,
  getApprovals,
  getEscalations,
} from './dashboard';

export type { DashboardStats } from './dashboard';
