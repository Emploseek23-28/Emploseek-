import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const contractNumber = searchParams.get("contract_number")
  const email = searchParams.get("email")

  if (!contractNumber || !email) {
    return NextResponse.json(
      { error: "Numero de contrat et email requis" },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data: contract, error } = await supabase
    .from("contracts")
    .select(`
      id,
      contract_number,
      status,
      start_date,
      end_date,
      type,
      clients!inner (
        first_name,
        last_name,
        email
      ),
      offers (
        title,
        company,
        type
      )
    `)
    .eq("contract_number", contractNumber)
    .eq("clients.email", email)
    .single()

  if (error || !contract) {
    return NextResponse.json(
      { error: "Contrat non trouve. Verifiez vos informations." },
      { status: 404 }
    )
  }

  return NextResponse.json({
    id: contract.id,
    contract_number: contract.contract_number,
    status: contract.status,
    start_date: contract.start_date,
    end_date: contract.end_date,
    type: contract.type,
    client: contract.clients,
    offer: contract.offers,
  })
}
