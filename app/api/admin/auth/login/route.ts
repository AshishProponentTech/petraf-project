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

    // According to documentation, admin gets credentials from seed script
    // This simulates the admin login for existing tenants
    // In production, this would validate against the database
    
    // Mock response for existing tenant (Sunrise Corp example from docs)
    if (company_name.toLowerCase().includes('sunrise') || company_name.toLowerCase().includes('test')) {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        tenant_id: '550e8400-e29b-41d4-a716-446655440000', // From documentation
        admin_key: 'admin_sk_sunrise_abc123xyz789', // From documentation
        company_name: 'Sunrise Corporation',
        admin_email: 'john.davis@sunrisecorp.com'
      })
    }

    // For other companies, they need to be created via seed script first
    return NextResponse.json(
      { 
        error: 'Company not found',
        message: 'Your company needs to be set up first via database seed script',
        instructions: 'Contact system administrator to run: python -m app.database.seed_tenant --slug "your-company" --name "Your Company" --domain "yourcompany.petraf.com" --admin-email "admin@yourcompany.com"'
      },
      { status: 404 }
    )

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
