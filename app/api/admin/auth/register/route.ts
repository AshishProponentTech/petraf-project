import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { company_name, admin_email, password } = await request.json()

    // Validate input
    if (!company_name || !admin_email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // According to documentation, tenant creation is done via seed script
    // This endpoint is for admin login only, not tenant creation
    return NextResponse.json(
      { 
        error: 'Tenant creation is done via database seed script, not API endpoint',
        message: 'Please contact system administrator to create your tenant account',
        instructions: 'Run: python -m app.database.seed_tenant --slug "company-slug" --name "Company Name" --domain "company.petraf.com" --admin-email "admin@company.com"'
      },
      { status: 501 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
