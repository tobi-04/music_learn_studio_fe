/**
 * Analytics related types
 */

export interface AnalyticsStats {
  totalRevenue: number;
  totalStudents: number;
  totalCourses: number;
  activeEnrollments: number;
}

export interface RevenueDataPoint {
  month: string;
  amount: number;
}

export interface PopularCourseData {
  courseName: string;
  studentCount: number;
}

export interface StudentGrowthData {
  month: string;
  count: number;
}

export interface AnalyticsResponse {
  stats: AnalyticsStats;
  revenueOverTime: RevenueDataPoint[];
  popularCourses: PopularCourseData[];
  studentGrowth: StudentGrowthData[];
}
