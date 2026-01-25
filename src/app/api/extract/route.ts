import { NextResponse } from "next/server";

// Types for extracted data
interface ExtractedData {
  columns: string[];
  rows: Record<string, string | number>[];
  summary: {
    totalRows: number;
    numericFields: string[];
    statusField?: string;
  };
}

export async function POST(request: Request) {
  try {
    const { image, prompt } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Return mock data for demo purposes
      return NextResponse.json({
        data: getMockData(prompt),
        source: "demo",
      });
    }

    // Extract base64 data
    const base64Data = image.split(",")[1];
    const mediaType = image.split(";")[0].split(":")[1] || "image/png";

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: base64Data,
                },
              },
              {
                type: "text",
                text: `Analyze this image and extract all data you can see into a structured JSON format.

The user wants to: ${prompt || "create a tracker/dashboard from this data"}

Return ONLY valid JSON in this exact format:
{
  "columns": ["Column1", "Column2", ...],
  "rows": [
    {"Column1": "value1", "Column2": "value2", ...},
    ...
  ],
  "summary": {
    "totalRows": number,
    "numericFields": ["field1", "field2"],
    "statusField": "fieldName" // if there's a status/state column
  }
}

Extract ALL visible data. If you see a table, spreadsheet, or list, capture every row and column.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Claude API error:", error);
      return NextResponse.json({
        data: getMockData(prompt),
        source: "demo",
        error: "API error, using demo data",
      });
    }

    const result = await response.json();
    const content = result.content[0]?.text || "";

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const extractedData = JSON.parse(jsonMatch[0]) as ExtractedData;
      return NextResponse.json({
        data: extractedData,
        source: "claude",
      });
    }

    // Fallback to mock data
    return NextResponse.json({
      data: getMockData(prompt),
      source: "demo",
    });
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json({
      data: getMockData(""),
      source: "demo",
      error: "Extraction failed, using demo data",
    });
  }
}

// Mock data for demo
function getMockData(prompt: string): ExtractedData {
  const lowerPrompt = (prompt || "").toLowerCase();

  if (lowerPrompt.includes("vendor") || lowerPrompt.includes("contract")) {
    return {
      columns: ["Vendor", "Contract Value", "Renewal Date", "Owner", "Status"],
      rows: [
        { Vendor: "Salesforce", "Contract Value": 24000, "Renewal Date": "2026-03-15", Owner: "Sarah Chen", Status: "Active" },
        { Vendor: "AWS", "Contract Value": 48000, "Renewal Date": "2026-02-01", Owner: "Mike Johnson", Status: "Renewal Soon" },
        { Vendor: "Slack", "Contract Value": 8400, "Renewal Date": "2026-06-30", Owner: "Sarah Chen", Status: "Active" },
        { Vendor: "Zoom", "Contract Value": 3600, "Renewal Date": "2026-01-31", Owner: "Lisa Park", Status: "Renewal Soon" },
        { Vendor: "HubSpot", "Contract Value": 18000, "Renewal Date": "2026-09-15", Owner: "Mike Johnson", Status: "Active" },
        { Vendor: "Figma", "Contract Value": 6000, "Renewal Date": "2026-04-01", Owner: "Design Team", Status: "Active" },
        { Vendor: "Notion", "Contract Value": 2400, "Renewal Date": "2026-05-20", Owner: "All Teams", Status: "Active" },
        { Vendor: "GitHub", "Contract Value": 12000, "Renewal Date": "2026-02-28", Owner: "Engineering", Status: "Renewal Soon" },
      ],
      summary: {
        totalRows: 8,
        numericFields: ["Contract Value"],
        statusField: "Status",
      },
    };
  }

  if (lowerPrompt.includes("sales") || lowerPrompt.includes("pipeline")) {
    return {
      columns: ["Deal", "Company", "Value", "Stage", "Close Date", "Rep"],
      rows: [
        { Deal: "Enterprise License", Company: "Acme Corp", Value: 125000, Stage: "Negotiation", "Close Date": "2026-02-15", Rep: "John Smith" },
        { Deal: "Team Plan Upgrade", Company: "TechStart Inc", Value: 45000, Stage: "Proposal", "Close Date": "2026-02-28", Rep: "Sarah Lee" },
        { Deal: "Annual Contract", Company: "Global Systems", Value: 280000, Stage: "Qualified", "Close Date": "2026-03-15", Rep: "John Smith" },
        { Deal: "Pilot Program", Company: "NewCo", Value: 15000, Stage: "Discovery", "Close Date": "2026-04-01", Rep: "Mike Chen" },
        { Deal: "Expansion", Company: "RetailMax", Value: 95000, Stage: "Negotiation", "Close Date": "2026-02-20", Rep: "Sarah Lee" },
      ],
      summary: {
        totalRows: 5,
        numericFields: ["Value"],
        statusField: "Stage",
      },
    };
  }

  // Default: onboarding checklist
  return {
    columns: ["Task", "Category", "Assignee", "Due Date", "Status"],
    rows: [
      { Task: "Complete I-9 form", Category: "HR", Assignee: "New Hire", "Due Date": "Day 1", Status: "Pending" },
      { Task: "Set up laptop", Category: "IT", Assignee: "IT Team", "Due Date": "Day 1", Status: "Pending" },
      { Task: "Review employee handbook", Category: "HR", Assignee: "New Hire", "Due Date": "Week 1", Status: "Pending" },
      { Task: "Meet with manager", Category: "Onboarding", Assignee: "Manager", "Due Date": "Day 1", Status: "Pending" },
      { Task: "Complete security training", Category: "Compliance", Assignee: "New Hire", "Due Date": "Week 1", Status: "Pending" },
      { Task: "Set up email signature", Category: "IT", Assignee: "New Hire", "Due Date": "Day 2", Status: "Pending" },
      { Task: "Tour office/facilities", Category: "Onboarding", Assignee: "HR", "Due Date": "Day 1", Status: "Pending" },
    ],
    summary: {
      totalRows: 7,
      numericFields: [],
      statusField: "Status",
    },
  };
}
