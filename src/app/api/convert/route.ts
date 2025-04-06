import { NextResponse } from "next/server";
import { env } from "@/env";

const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];

const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  ...IMAGE_MIME_TYPES,
  'text/html',
  'application/xml',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.macroenabled.12',
  'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  'application/vnd.ms-excel',
  'application/vnd.oasis.opendocument.spreadsheet',
  'text/csv',
  'application/vnd.apple.numbers'
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const customApiToken = formData.get("apiToken") as string;
    const customAccountId = formData.get("accountId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check if it's an image and if custom credentials are not provided
    if (IMAGE_MIME_TYPES.includes(file.type) && !customApiToken) {
      return NextResponse.json(
        { error: "Image uploads require custom Cloudflare credentials" },
        { status: 400 }
      );
    }

    if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a supported document type." },
        { status: 400 }
      );
    }

    const cloudflareFormData = new FormData();
    cloudflareFormData.append("files", file);

    // Use custom credentials if provided, otherwise fall back to environment variables
    const apiToken = customApiToken || env.CLOUDFLARE_API_TOKEN;
    const accountId = customAccountId || env.CLOUDFLARE_ACCOUNT_ID;

    if (!apiToken || !accountId) {
      return NextResponse.json(
        { error: "Missing Cloudflare credentials" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/tomarkdown`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: cloudflareFormData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: "Failed to convert file" },
        { status: response.status }
      );
    }

    const data = await response.json();
    if (!data.success || !data.result?.[0]) {
      throw new Error("Invalid response from Cloudflare API");
    }

    const result = data.result[0];
    return NextResponse.json({
      name: result.name,
      mimeType: result.mimeType,
      format: result.format,
      tokens: result.tokens,
      markdown: result.data
    });
  } catch (error) {
    console.error("Error converting file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
