"use client";

import { useState } from "react";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
} from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Download,
  TrendingUp,
  Users,
  Building2,
  UserCheck,
  Clock,
  Calendar,
  FileText,
  DollarSign,
  Shield,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Colors
const COLORS = {
  blue: "#3b82f6",
  emerald: "#10b981",
  purple: "#8b5cf6",
  yellow: "#f59e0b",
  red: "#ef4444",
  pink: "#ec4899",
  indigo: "#6366f1",
  cyan: "#06b6d4",
  gray: "#6b7280",
};

const STATUS_COLORS = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
  verified: "#8b5cf6",
  active: "#3b82f6",
  inactive: "#6b7280",
};

// Generate monthly data for the current year
const generateMonthlyData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month, index) => ({
    month,
    companies: Math.floor(Math.random() * 30) + 5,
    employees: Math.floor(Math.random() * 100) + 20,
    pending: Math.floor(Math.random() * 15),
    approved: Math.floor(Math.random() * 25),
    verified: Math.floor(Math.random() * 20),
    rejected: Math.floor(Math.random() * 5),
  }));
};

// Generate company monthly data with breakdown
const generateCompanyMonthlyData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month) => ({
    month,
    pending: Math.floor(Math.random() * 10),
    approved: Math.floor(Math.random() * 15),
    rejected: Math.floor(Math.random() * 3),
    total: Math.floor(Math.random() * 25) + 5,
  }));
};

// Generate employee monthly data with breakdown
const generateEmployeeMonthlyData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month) => ({
    month,
    pending: Math.floor(Math.random() * 20),
    approved: Math.floor(Math.random() * 30),
    verified: Math.floor(Math.random() * 25),
    rejected: Math.floor(Math.random() * 5),
    total: Math.floor(Math.random() * 70) + 10,
  }));
};

// Generate recent activity
const generateRecentActivity = (count: number) => {
  const types = ["company", "employee", "individual"];
  const names = [
    "Acme Corporation",
    "John Doe",
    "Jane Smith",
    "Tech Solutions Ltd",
    "Michael Johnson",
    "Sarah Williams",
    "Global Insurance Co",
    "David Brown",
    "Emma Davis",
    "First Bank Plc",
    "Robert Wilson",
    "Lisa Anderson",
  ];
  const statuses = ["pending", "approved", "verified", "rejected"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    name: names[Math.floor(Math.random() * names.length)],
    email: `${names[i].toLowerCase().replace(/\s+/g, ".")}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    submitted_at: subDays(
      new Date(),
      Math.floor(Math.random() * 7),
    ).toISOString(),
  })).sort(
    (a, b) =>
      new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime(),
  );
};

// Dummy analytics data
const dummyAnalyticsData = {
  company_registrations: {
    total: 248,
    by_status: {
      pending_approval: 42,
      approved: 156,
      rejected: 50,
    },
    by_account_status: {
      pending: 38,
      invited: 45,
      active: 165,
    },
    by_verification_status: {
      not_verified: 98,
      verified: 150,
    },
  },
  employee_registrations: {
    total: 1247,
    by_status: {
      pending_approval: 215,
      approved: 732,
      rejected: 300,
    },
    by_account_status: {
      pending: 180,
      invited: 220,
      active: 847,
    },
    by_verification_status: {
      not_verified: 520,
      verified: 727,
    },
  },
  monthly_data: generateMonthlyData(),
  company_monthly_data: generateCompanyMonthlyData(),
  employee_monthly_data: generateEmployeeMonthlyData(),
  recent_activity: generateRecentActivity(10),
  verification_stats: {
    success_rate: 85,
    failed_rate: 15,
    validated: 65,
    mismatch: 20,
    pending_validation: 15,
  },
};

interface ReportsPageProps {
  role: "admin" | "company" | "employee";
}

export default function ReportsPage({ role }: ReportsPageProps) {
  const [dateRange, setDateRange] = useState<
    "7days" | "30days" | "month" | "custom"
  >("30days");
  const [selectedChart, setSelectedChart] = useState<string>("all");

  const isAdmin = role === "admin";
  const theme = isAdmin ? "blue" : "emerald";

  // Use dummy data
  const data = dummyAnalyticsData;

  const handleExport = (format: "pdf" | "csv" | "excel") => {
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  // KPI Cards Data
  const kpiData = [
    {
      title: "Total Companies",
      value: data.company_registrations.total,
      change: "+12",
      icon: Building2,
      color: isAdmin ? "blue" : "emerald",
      bgColor: isAdmin ? "bg-blue-100" : "bg-emerald-100",
      textColor: isAdmin ? "text-blue-600" : "text-emerald-600",
    },
    {
      title: "Total Employees",
      value: data.employee_registrations.total,
      change: "+8",
      icon: Users,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Pending Approvals",
      value:
        data.company_registrations.by_status.pending_approval +
        data.employee_registrations.by_status.pending_approval,
      change: "+5",
      icon: Clock,
      color: "yellow",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
    {
      title: "Verified",
      value: data.employee_registrations.by_verification_status.verified,
      change: "+15",
      icon: UserCheck,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={cn(
              "text-3xl font-bold tracking-tight bg-linear-to-r bg-clip-text text-transparent",
              isAdmin
                ? "from-blue-600 to-blue-800"
                : "from-emerald-600 to-emerald-800",
            )}
          >
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            View insights and trends across your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={dateRange}
            onValueChange={(value: any) => setDateRange(value)}
          >
            <SelectTrigger className="w-45">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedChart} onValueChange={setSelectedChart}>
            <SelectTrigger className="w-45">
              <FileText className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="companies">Companies</SelectItem>
              <SelectItem value="employees">Employees</SelectItem>
              <SelectItem value="verification">Verification</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => handleExport("csv")}
            className={cn(
              isAdmin && "hover:bg-blue-50 hover:text-blue-600",
              !isAdmin && "hover:bg-emerald-50 hover:text-emerald-600",
            )}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {kpi.value.toLocaleString()}
                  </p>
                </div>
                <div className={cn("p-3 rounded-full", kpi.bgColor)}>
                  <kpi.icon className={cn("h-5 w-5", kpi.textColor)} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">
                  {kpi.change}%
                </span>
                <span className="text-muted-foreground ml-2">
                  vs last period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Registrations Over Time */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Registrations Over Time</CardTitle>
              <CardDescription>
                Monthly registration trends for companies and employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-100">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.monthly_data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="companies"
                      stackId="1"
                      stroke={COLORS.blue}
                      fill={COLORS.blue}
                      fillOpacity={0.3}
                      name="Companies"
                    />
                    <Area
                      type="monotone"
                      dataKey="employees"
                      stackId="2"
                      stroke={COLORS.emerald}
                      fill={COLORS.emerald}
                      fillOpacity={0.3}
                      name="Employees"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Company Status Distribution</CardTitle>
                <CardDescription>
                  Breakdown of companies by current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-75">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Pending",
                            value:
                              data.company_registrations.by_status
                                .pending_approval,
                          },
                          {
                            name: "Approved",
                            value:
                              data.company_registrations.by_status.approved,
                          },
                          {
                            name: "Rejected",
                            value:
                              data.company_registrations.by_status.rejected,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent ? percent : 0 * 100).toFixed(0)}%`
                        }
                      >
                        <Cell fill={STATUS_COLORS.pending} />
                        <Cell fill={STATUS_COLORS.approved} />
                        <Cell fill={STATUS_COLORS.rejected} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Employee Status Distribution</CardTitle>
                <CardDescription>
                  Breakdown of employees by current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-75">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Pending",
                            value:
                              data.employee_registrations.by_status
                                .pending_approval,
                          },
                          {
                            name: "Approved",
                            value:
                              data.employee_registrations.by_status.approved,
                          },
                          {
                            name: "Rejected",
                            value:
                              data.employee_registrations.by_status.rejected,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent ? percent : 0 * 100).toFixed(0)}%`
                        }
                      >
                        <Cell fill={STATUS_COLORS.pending} />
                        <Cell fill={STATUS_COLORS.approved} />
                        <Cell fill={STATUS_COLORS.rejected} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Company Registration Trends</CardTitle>
              <CardDescription>
                Monthly breakdown of company registrations by status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.company_monthly_data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="pending"
                      stackId="a"
                      fill={STATUS_COLORS.pending}
                      name="Pending"
                    />
                    <Bar
                      dataKey="approved"
                      stackId="a"
                      fill={STATUS_COLORS.approved}
                      name="Approved"
                    />
                    <Bar
                      dataKey="rejected"
                      stackId="a"
                      fill={STATUS_COLORS.rejected}
                      name="Rejected"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Company Account Status */}
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>
                  Company accounts by lifecycle stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-75">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Pending",
                            value:
                              data.company_registrations.by_account_status
                                .pending,
                          },
                          {
                            name: "Invited",
                            value:
                              data.company_registrations.by_account_status
                                .invited,
                          },
                          {
                            name: "Active",
                            value:
                              data.company_registrations.by_account_status
                                .active,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        <Cell fill={STATUS_COLORS.pending} />
                        <Cell fill={COLORS.purple} />
                        <Cell fill={STATUS_COLORS.active} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Document Verification</CardTitle>
                <CardDescription>
                  Companies with verified vs unverified documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-75">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Verified",
                            value:
                              data.company_registrations.by_verification_status
                                .verified,
                          },
                          {
                            name: "Not Verified",
                            value:
                              data.company_registrations.by_verification_status
                                .not_verified,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        <Cell fill={STATUS_COLORS.verified} />
                        <Cell fill={COLORS.gray} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Employee Registration Trends</CardTitle>
              <CardDescription>
                Monthly breakdown of employee registrations by status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.employee_monthly_data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="pending"
                      stackId="a"
                      fill={STATUS_COLORS.pending}
                      name="Pending"
                    />
                    <Bar
                      dataKey="approved"
                      stackId="a"
                      fill={STATUS_COLORS.approved}
                      name="Approved"
                    />
                    <Bar
                      dataKey="verified"
                      stackId="a"
                      fill={STATUS_COLORS.verified}
                      name="Verified"
                    />
                    <Bar
                      dataKey="rejected"
                      stackId="a"
                      fill={STATUS_COLORS.rejected}
                      name="Rejected"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Employee Account Status */}
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>
                  Employee accounts by lifecycle stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-75">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Pending",
                            value:
                              data.employee_registrations.by_account_status
                                .pending,
                          },
                          {
                            name: "Invited",
                            value:
                              data.employee_registrations.by_account_status
                                .invited,
                          },
                          {
                            name: "Active",
                            value:
                              data.employee_registrations.by_account_status
                                .active,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        <Cell fill={STATUS_COLORS.pending} />
                        <Cell fill={COLORS.purple} />
                        <Cell fill={STATUS_COLORS.active} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>NIN Verification</CardTitle>
                <CardDescription>
                  Employees with verified vs unverified NIN
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-75">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Verified",
                            value:
                              data.employee_registrations.by_verification_status
                                .verified,
                          },
                          {
                            name: "Not Verified",
                            value:
                              data.employee_registrations.by_verification_status
                                .not_verified,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        <Cell fill={STATUS_COLORS.verified} />
                        <Cell fill={COLORS.gray} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verification">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>NIN Verification Success Rate</CardTitle>
                <CardDescription>
                  Percentage of successful NIN verifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-75">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Successful",
                            value: data.verification_stats.success_rate,
                          },
                          {
                            name: "Failed",
                            value: data.verification_stats.failed_rate,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        <Cell fill={COLORS.emerald} />
                        <Cell fill={COLORS.red} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Validation Status</CardTitle>
                <CardDescription>
                  Employee data matching NIN records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-75">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Validated",
                            value: data.verification_stats.validated,
                          },
                          {
                            name: "Mismatch",
                            value: data.verification_stats.mismatch,
                          },
                          {
                            name: "Pending",
                            value: data.verification_stats.pending_validation,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        <Cell fill={COLORS.emerald} />
                        <Cell fill={COLORS.yellow} />
                        <Cell fill={COLORS.gray} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verification Timeline */}
          <Card className="border-0 shadow-lg mt-4">
            <CardHeader>
              <CardTitle>Verification Timeline</CardTitle>
              <CardDescription>Monthly verification trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-75">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthly_data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="verified"
                      stroke={COLORS.emerald}
                      strokeWidth={2}
                      name="Verified"
                    />
                    <Line
                      type="monotone"
                      dataKey="pending"
                      stroke={COLORS.yellow}
                      strokeWidth={2}
                      name="Pending"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest registrations and verifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recent_activity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {activity.type === "company" ? (
                    <Building2 className="h-5 w-5 text-blue-500" />
                  ) : activity.type === "employee" ? (
                    <Users className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <UserCheck className="h-5 w-5 text-purple-500" />
                  )}
                  <div>
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      activity.status === "pending" &&
                        "bg-yellow-100 text-yellow-800 border-yellow-200",
                      activity.status === "approved" &&
                        "bg-green-100 text-green-800 border-green-200",
                      activity.status === "verified" &&
                        "bg-purple-100 text-purple-800 border-purple-200",
                      activity.status === "rejected" &&
                        "bg-red-100 text-red-800 border-red-200",
                    )}
                  >
                    {activity.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(activity.submitted_at), "MMM d, h:mm a")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
