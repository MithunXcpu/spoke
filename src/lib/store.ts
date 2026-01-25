// Simple in-memory store (in production, use a database)
// This persists during the session but resets on server restart

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  department: string;
  role: "admin" | "user";
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  outputType: "tracker" | "dashboard" | "checklist";
  data: {
    columns: string[];
    rows: Record<string, string | number>[];
    summary: {
      totalRows: number;
      numericFields: string[];
      statusField?: string;
    };
  };
  createdBy: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  createdBy: string;
}

// Demo users
const users: User[] = [
  { id: "1", email: "admin@spoke.dev", password: "admin123", name: "Admin User", department: "all", role: "admin" },
  { id: "2", email: "sales@spoke.dev", password: "sales123", name: "Sales Team", department: "sales", role: "user" },
  { id: "3", email: "ops@spoke.dev", password: "ops123", name: "Operations", department: "operations", role: "user" },
  { id: "4", email: "hr@spoke.dev", password: "hr123", name: "HR Team", department: "hr", role: "user" },
];

// Demo departments
const departments: Department[] = [
  { id: "1", name: "Sales", slug: "sales", createdBy: "1" },
  { id: "2", name: "Operations", slug: "operations", createdBy: "1" },
  { id: "3", name: "HR", slug: "hr", createdBy: "1" },
  { id: "4", name: "Engineering", slug: "engineering", createdBy: "1" },
];

// Tools storage
const tools: Tool[] = [
  {
    id: "demo-1",
    name: "Vendor Contract Tracker",
    description: "Track all vendor contracts and renewal dates",
    outputType: "tracker",
    data: {
      columns: ["Vendor", "Contract Value", "Renewal Date", "Owner", "Status"],
      rows: [
        { Vendor: "Salesforce", "Contract Value": 24000, "Renewal Date": "2026-03-15", Owner: "Sarah Chen", Status: "Active" },
        { Vendor: "AWS", "Contract Value": 48000, "Renewal Date": "2026-02-01", Owner: "Mike Johnson", Status: "Renewal Soon" },
        { Vendor: "Slack", "Contract Value": 8400, "Renewal Date": "2026-06-30", Owner: "Sarah Chen", Status: "Active" },
      ],
      summary: { totalRows: 3, numericFields: ["Contract Value"], statusField: "Status" },
    },
    createdBy: "2",
    department: "sales",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-20T10:00:00Z",
    isPublic: true,
  },
];

// Auth functions
export function authenticateUser(email: string, password: string): User | null {
  return users.find((u) => u.email === email && u.password === password) || null;
}

export function getUserById(id: string): User | null {
  return users.find((u) => u.id === id) || null;
}

export function createUser(user: Omit<User, "id">): User {
  const newUser = { ...user, id: String(users.length + 1) };
  users.push(newUser);
  return newUser;
}

// Department functions
export function getDepartments(): Department[] {
  return departments;
}

export function getDepartmentBySlug(slug: string): Department | null {
  return departments.find((d) => d.slug === slug) || null;
}

// Tool functions
export function getTools(department?: string): Tool[] {
  if (!department || department === "all") return tools;
  return tools.filter((t) => t.department === department);
}

export function getToolById(id: string): Tool | null {
  return tools.find((t) => t.id === id) || null;
}

export function createTool(tool: Omit<Tool, "id" | "createdAt" | "updatedAt">): Tool {
  const newTool: Tool = {
    ...tool,
    id: `tool-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tools.push(newTool);
  return newTool;
}

export function updateTool(id: string, updates: Partial<Tool>): Tool | null {
  const index = tools.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tools[index] = { ...tools[index], ...updates, updatedAt: new Date().toISOString() };
  return tools[index];
}

export function deleteTool(id: string): boolean {
  const index = tools.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tools.splice(index, 1);
  return true;
}
