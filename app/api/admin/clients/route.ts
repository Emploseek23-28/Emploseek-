import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !user.user_metadata?.is_admin) {
    return null
  }
  return supabase
}

export async function GET() {
  const supabase = await checkAdmin()
  if (!supabase) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await checkAdmin()
  if (!supabase) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 })
  }

  const body = await request.json()
  
  const { data, error } = await supabase
    .from("clients")
    .insert({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
